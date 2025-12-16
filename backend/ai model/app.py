import os
import json
import numpy as np
import cv2
import tensorflow as tf
from PIL import Image
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import base64
import io

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Force TensorFlow to use eager execution
tf.keras.backend.clear_session()
tf.config.run_functions_eagerly(True)

class NepaliWordRecognitionWeb:
    def __init__(self):
        self.model = None
        self.char_to_label = {}
        self.label_to_char = {}
        self.img_height = 64
        self.img_width = 64
        
        # Nepali character set
        self.nepali_chars = [
            'क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ',
            'ट', 'ठ', 'ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न',
            'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श',
            'ष', 'स', 'ह', 'क्ष', 'त्र', 'ज्ञ',
            'अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ'
        ]
        
        self.char_to_label = {ch: i for i, ch in enumerate(self.nepali_chars)}
        self.label_to_char = {i: ch for i, ch in enumerate(self.nepali_chars)}
        
        # Load model on startup
        self.load_model("nepali_model_clean.h5")
    
    def load_model(self, model_path):
        """Load the trained model"""
        try:
            if os.path.exists(model_path):
                self.model = tf.keras.models.load_model(model_path)
                
                # Load label mappings
                label_path = model_path.replace('.h5', '_labels.json')
                if os.path.exists(label_path):
                    with open(label_path, 'r', encoding='utf-8') as f:
                        label_data = json.load(f)
                        self.nepali_chars = label_data.get('nepali_chars', self.nepali_chars)
                        self.char_to_label = label_data.get('char_to_label', {})
                        self.label_to_char = {int(k): v for k, v in label_data.get('label_to_char', {}).items()}
                
                print("✅ Model loaded successfully!")
                return True
            else:
                print("❌ Model file not found!")
                return False
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            return False
    
    def _pad_to_square_and_resize(self, img_gray_f32):
        h, w = img_gray_f32.shape
        size = max(h, w)
        canvas = np.ones((size, size), dtype=np.float32)
        y0 = (size - h) // 2
        x0 = (size - w) // 2
        canvas[y0:y0 + h, x0:x0 + w] = img_gray_f32
        out = cv2.resize(canvas, (self.img_width, self.img_height), interpolation=cv2.INTER_AREA)
        return out
    
    def preprocess_array(self, img_gray_uint8):
        arr = img_gray_uint8.astype(np.float32) / 255.0
        arr = self._pad_to_square_and_resize(arr)
        arr = np.expand_dims(arr, axis=-1)
        return arr
    
    def segment_characters(self, word_image):
        """Segment characters from word image"""
        if len(word_image.shape) == 3:
            word_image = cv2.cvtColor(word_image, cv2.COLOR_BGR2GRAY)
        
        # Use Otsu's thresholding
        _, binary = cv2.threshold(word_image, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        
        # Morphological operations
        kernel = np.ones((2, 2), np.uint8)
        binary = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)
        binary = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel)
        
        # Find contours
        contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        boxes = []
        for c in contours:
            x, y, w, h = cv2.boundingRect(c)
            area = w * h
            if (15 <= w <= 300 and 20 <= h <= 300 and area >= 100):
                boxes.append((x, y, w, h))
        
        # Sort by x-coordinate and remove overlaps
        boxes.sort(key=lambda b: b[0])
        boxes = self._suppress_overlaps(boxes)
        
        # Extract characters
        chars = []
        for (x, y, w, h) in boxes:
            pad_x = max(5, w // 8)
            pad_y = max(5, h // 8)
            x1, y1 = max(0, x - pad_x), max(0, y - pad_y)
            x2, y2 = min(word_image.shape[1], x + w + pad_x), min(word_image.shape[0], y + h + pad_y)
            
            char_img = word_image[y1:y2, x1:x2]
            if char_img.size > 0:
                chars.append(char_img)
        
        return chars
    
    def _suppress_overlaps(self, boxes, iou_thresh=0.3):
        def iou(a, b):
            ax, ay, aw, ah = a
            bx, by, bw, bh = b
            x1, y1 = max(ax, bx), max(ay, by)
            x2, y2 = min(ax + aw, bx + bw), min(ay + ah, by + bh)
            inter = max(0, x2 - x1) * max(0, y2 - y1)
            union = aw * ah + bw * bh - inter + 1e-9
            return inter / union
        
        kept = []
        for b in boxes:
            if all(iou(b, kb) < iou_thresh for kb in kept):
                kept.append(b)
        return kept
    
    def recognize_word(self, image_data):
        """Recognize word from image data"""
        if self.model is None:
            return {"error": "Model not loaded. Please train a model first."}
        
        try:
            # Convert base64 image to numpy array
            if ',' in image_data:
                image_data = image_data.split(',')[1]
            
            image_bytes = base64.b64decode(image_data)
            image_array = np.frombuffer(image_bytes, dtype=np.uint8)
            word_img = cv2.imdecode(image_array, cv2.IMREAD_GRAYSCALE)
            
            if word_img is None:
                return {"error": "Could not decode image"}
            
            # Segment characters
            chars_imgs = self.segment_characters(word_img)
            
            # Fallback: use entire image
            if len(chars_imgs) == 0:
                chars_imgs = [word_img]
            
            raw_chars, confs = [], []
            for cimg in chars_imgs:
                try:
                    x = self.preprocess_array(cimg)
                    x = np.expand_dims(x, axis=0)
                    preds = self.model.predict(x, verbose=0)[0]
                    
                    label = np.argmax(preds)
                    conf = np.max(preds)
                    ch = self.label_to_char.get(int(label), '?')
                    
                    raw_chars.append(ch)
                    confs.append(float(conf))
                    
                except Exception as e:
                    print(f"Error processing character: {e}")
                    continue
            
            # Process results
            if raw_chars:
                # Filter low confidence characters
                filtered_chars = []
                filtered_confs = []
                for ch, conf in zip(raw_chars, confs):
                    if conf >= 0.1:
                        filtered_chars.append(ch)
                        filtered_confs.append(conf)
                
                # Remove consecutive duplicates
                final_chars = []
                final_confs = []
                for i, (ch, conf) in enumerate(zip(filtered_chars, filtered_confs)):
                    if i == 0 or ch != final_chars[-1]:
                        final_chars.append(ch)
                        final_confs.append(conf)
            else:
                final_chars, final_confs = [], []
            
            avg_conf = np.mean(final_confs) if final_confs else 0.0
            
            result = {
                'success': True,
                'word': ''.join(final_chars) if final_chars else "No characters recognized",
                'confidence': float(avg_conf),
                'characters': [
                    {'character': ch, 'confidence': conf} 
                    for ch, conf in zip(final_chars, final_confs)
                ]
            }
            
            return result
            
        except Exception as e:
            return {"error": f"Recognition failed: {str(e)}"}

# Initialize the recognizer
recognizer = NepaliWordRecognitionWeb()

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/recognize', methods=['POST'])
def recognize():
    try:
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400
        
        image_data = data['image']
        result = recognizer.recognize_word(image_data)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'model_loaded': recognizer.model is not None})

if __name__ == '__main__':
    # Create templates directory if it doesn't exist
    os.makedirs('templates', exist_ok=True)
    
    print("🚀 Starting Nepali Word Recognition Web Server...")
    print("📝 Access the application at: http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)