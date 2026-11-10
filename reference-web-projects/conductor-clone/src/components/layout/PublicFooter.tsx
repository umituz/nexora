import { Link } from "react-router-dom";
import { APP_NAME, APP_COMPANY, APP_YEAR, APP_LOCATION, FOOTER_LINKS } from "@/lib/constants";

export function PublicFooter() {
  return (
    <footer className="hero-section stars-bg border-t border-border/10">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-mint">
                <span className="text-sm font-bold">C</span>
              </div>
              {APP_NAME.toUpperCase()}
            </Link>
            <p className="mt-4 text-sm text-white/40">
              Designed and built in {APP_LOCATION}.
            </p>
            <p className="mt-2 text-sm text-white/30">
              © {APP_YEAR} {APP_COMPANY}
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-4 text-sm font-semibold capitalize text-white/60">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-white/40 transition-colors hover:text-white/80"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
