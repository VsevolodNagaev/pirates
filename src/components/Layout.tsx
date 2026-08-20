import { NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Главная", end: true },
  { to: "/news", label: "Новости", end: false },
  { to: "/rules", label: "Правила", end: false },
  { to: "/refs", label: "Референсы", end: false },
];

export function Layout() {
  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-40 border-b border-gold/20 bg-oak/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <NavLink
            to="/"
            className="font-display text-2xl tracking-wide text-gold"
          >
            Ливонский ветер
          </NavLink>
          <nav className="flex gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-1.5 text-sm uppercase tracking-[0.14em]",
                    isActive
                      ? "bg-gold/15 text-gold"
                      : "text-parchment/70 hover:text-parchment",
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-gold/15 px-4 py-6 text-center text-sm text-parchment/45">
        Ливонский ветер &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
