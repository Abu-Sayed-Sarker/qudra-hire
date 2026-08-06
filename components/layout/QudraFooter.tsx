import Link from "next/link";

export default function QudraFooter() {
  return (
    <footer className="border-t border-surface bg-surface text-on-surface-subtle text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="space-y-3">
          <Link href="/" className="flex items-center gap-1">
            <span className="text-lg font-extrabold text-on-surface">
              CareerSprint
            </span>
          </Link>
          <p className="leading-relaxed text-on-surface-muted text-sm">
            AI-powered hiring for the GCC. Stop searching. Start progressing.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-on-surface font-semibold text-sm">Platform</h4>
          <ul className="space-y-2">
            {["Find jobs", "Pricing"].map((item) => (
              <li key={item}>
                <Link
                  href="/"
                  className="hover:text-on-surface transition-colors text-sm"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-on-surface font-semibold text-sm">Company</h4>
          <ul className="space-y-2">
            {["About", "Contact"].map((item) => (
              <li key={item}>
                <Link
                  href="/"
                  className="hover:text-on-surface transition-colors text-sm"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-surface max-w-7xl mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-on-surface-subtle">
        <span>© 2026 Career Sprint. All rights reserved.</span>
        <span className="flex items-center gap-2">
          Built for the GCC
          <span className="mx-1 opacity-40">•</span>
          <Link href="/contact?lang=en" className="hover:text-on-surface-muted transition-colors">EN</Link>
          <span className="opacity-40">/</span>
          <Link href="/contact?lang=ar" className="hover:text-on-surface-muted transition-colors">العربية</Link>
        </span>
      </div>
    </footer>
  );
}
