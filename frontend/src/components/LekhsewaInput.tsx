"use client";
import { useRef, useState } from "react";
import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import { Button } from "@heroui/react";

export default function LekhsewaInput() {
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const tldrawContainerRef = useRef<HTMLDivElement>(null);

  const handleSendToBackend = async () => {
    if (!tldrawContainerRef.current) return;
    const canvasElement = tldrawContainerRef.current.querySelector<HTMLCanvasElement>(".tl-canvas");
    if (!canvasElement) return;

    setIsSubmitting(true);
    setStatusMessage("Processing...");

    const stream = canvasElement.captureStream(25);
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);

    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const formData = new FormData();
      // This matches your backend: @RequestParam("file")
      formData.append("file", blob, "drawing.webm");

      try {
        const response = await fetch("/api/sendcanvasimage", { method: "POST", body: formData });
        if (!response.ok) throw new Error("Server responded with an error.");

        const result = await response.json();
        setStatusMessage(`Success! ID: ${result.data.canvas_id}`);
        setTimeout(() => setIsCanvasOpen(false), 2000);

      } catch (error) {
        setStatusMessage("Failed to send drawing.");
      } finally {
        setIsSubmitting(false);
      }
    };
    recorder.start();
    setTimeout(() => recorder.stop(), 100);
  };

  return (
    <div style={{ margin: "24px auto" }}>
      <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Draw Nepali Character</label>
      <input type="text" placeholder="Click here to draw" onClick={() => setIsCanvasOpen(true)} readOnly style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #d0d0d0", cursor: "pointer" }} />

      {isCanvasOpen && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div style={{background: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', padding: '10px'}}>
            <div ref={tldrawContainerRef} style={{ width: 500, height: 400, position: 'relative' }}>
              <Tldraw persistenceKey="lekhsewa-canvas" />
            </div>
            <div style={{ padding: '10px', display: 'flex', justifyContent: 'flex-end', gap: '10px', alignItems: 'center' }}>
              {statusMessage && <p style={{ marginRight: 'auto', fontSize: '14px' }}>{statusMessage}</p>}
              <Button variant="soft" onClick={() => setIsCanvasOpen(false)} disabled={isSubmitting}>Cancel</Button>
              <Button color="primary" onClick={handleSendToBackend} disabled={isSubmitting}>{isSubmitting ? "Sending..." : "Done"}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}