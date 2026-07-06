function Footer() {
  return (
    <footer data-testid="footer" className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm">
        <p className="text-base font-semibold text-white">
          <span>Byte</span>
          <span className="text-blue-400">Core</span>
        </p>
        <p className="mt-2 max-w-md">
          Serious hardware for serious builds. Curated PC components, picked and priced for builders
          who know what they want.
        </p>
        <p className="mt-4 text-slate-400">Portfolio demo — no real orders.</p>
        <p className="mt-2 text-slate-500">&copy; {new Date().getFullYear()} ByteCore</p>
      </div>
    </footer>
  );
}

export default Footer;
