// src/app/page.tsx
import { SiteNavbar } from "@/components/Navbar";
import LekhsewaInput from "@/components/LekhsewaInput";

export default function HomePage() {
  return (
    <main>
      <SiteNavbar />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '120px 20px 20px 20px', textAlign: 'center' }}>
        <h1 className="text-4xl font-bold">Welcome to Lekhsewa</h1>
        <p className="text-lg text-gray-600 mt-2">Your Nepali Typing Assistant</p>
        <form style={{ width: '100%', maxWidth: '400px', marginTop: '30px' }}>
          <LekhsewaInput />
        </form>
      </div>
    </main>
  );
}