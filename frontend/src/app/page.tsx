import { SiteNavbar } from "@/components/Navbar"; // Correct path

export default function HomePage() {
  return (
    <main>
      <SiteNavbar /> 
      <div style={{ paddingTop: '120px', textAlign: 'center' }}>
        <h1 className="text-4xl font-bold">Welcome to Lekhsewa</h1>
      </div>
    </main>
  );
}