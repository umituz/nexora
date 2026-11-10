import { Link } from "react-router-dom";
import { APP_NAME, NAV_LINKS } from "@/lib/constants";

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg text-foreground">
              <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-xs font-bold">M</span>
              </div>
              {APP_NAME}
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Production-ready by default with everything you need to go live.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to={NAV_LINKS.pricing} className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link to={NAV_LINKS.docs} className="hover:text-foreground transition-colors">Documentation</Link></li>
              <li><Link to={NAV_LINKS.blog} className="hover:text-foreground transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/features/authentication" className="hover:text-foreground transition-colors">Authentication</Link></li>
              <li><Link to="/features/database" className="hover:text-foreground transition-colors">Database</Link></li>
              <li><Link to="/features/monitoring" className="hover:text-foreground transition-colors">Monitoring</Link></li>
              <li><Link to="/features/cloud" className="hover:text-foreground transition-colors">Managed Cloud</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link to="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Discord</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">GitHub</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
