export default function Offline() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      
      <h1 className="text-2xl font-bold">Du är offline</h1>
      <p className="max-w-sm text-muted">Den här sidan har du inte öppnat tidigare, så den finns inte sparad. Lektioner du redan har besökt fungerar offline. Prov kräver internet.</p>
      <a href="/" className="btn btn-gold">Till startsidan</a>
    </main>
  );
}
