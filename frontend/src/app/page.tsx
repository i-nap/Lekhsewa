import ImageUploader from '../components/ImageUploader';

export default function Home() {
  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif', background: '#000', color: '#fff' }}>
      <h1>Frontend for Image Upload Test</h1>
      <ImageUploader />
    </main>
  );
}