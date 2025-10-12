
'use client';

import { useState, ChangeEvent } from 'react';

export default function ImageUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setMessage(`File selected: ${file.name}`);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    const apiUrl = 'http://localhost:8080';

    setMessage('Uploading...');

    try {
    
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(` Upload successful! Canvas ID: ${result.canvas_id}`);
      } else {
        const errorText = await response.text();
        setMessage(` Upload failed: ${response.statusText} (${errorText})`);
      }
    } catch (error) {
      console.error('An error occurred during the upload:', error);
      setMessage(' An error occurred. Check the console.');
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px', marginTop: '20px' }}>
      <h3>Upload an Image to Test Backend</h3>
      
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      
      <button onClick={handleUpload} disabled={!selectedFile} style={{ marginTop: '10px' }}>
        Upload Image
      </button>

      {message && <p style={{ marginTop: '15px' }}>{message}</p>}
    </div>
  );
}