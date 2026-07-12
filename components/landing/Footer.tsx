import { Scissors, Facebook, Twitter, Linkedin, Instagram, ArrowUp } from "lucide-react";

const cols = [
  { title: "Product", links: ["Features", "Pricing", "How It Works", "Solutions"] },
  { title: "Company", links: ["About", "Careers", "Blog", "Contact"] },
  { title: "Resources", links: ["Help Center", "Tutorials", "Community", "API Docs"] },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-primary/10 pt-16">
      <div className="mx-auto max-w-7xl px-6 pb-10">
        <div className="grid grid-cols-2 gap-10 pb-12 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2">
            <a href="#home" className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/40 bg-primary/10 text-primary">
                <Scissors size={16} />
              </span>
              NEYORA
            </a>
            <p className="max-w-xs text-sm text-secondary">
              Crafting the future of tailoring &mdash; AI-powered patterns, measurements,
              and business management in one workspace.
            </p>
            <div className="mt-5 flex gap-3">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 text-secondary transition hover:border-primary/60 hover:text-primary"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-medium text-white">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-secondary transition hover:text-primary">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-primary/10 pt-6 sm:flex-row">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-secondary">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Refund Policy</span>
            <span>&copy; 2026 Neyora. All rights reserved.</span>
          </div>
          <a
            href="#home"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 text-primary transition hover:bg-primary/10"
            aria-label="Back to top"
          >
            <ArrowUp size={15} />
          </a>
        </div>
      </div>
    </footer>
  );
}
