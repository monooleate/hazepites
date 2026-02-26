const FOOTER_LINKS = [
  {
    title: "Témakörök",
    links: [
      { name: "Alapok", href: "/alapok" },
      { name: "Háztípusok", href: "/haztipusok" },
      { name: "Költségek", href: "/koltsegek" },
      { name: "Támogatások", href: "/tamogatasok" },
    ],
  },
  {
    title: "Továbbiak",
    links: [
      { name: "Energia", href: "/energia" },
      { name: "Tervezés", href: "/tervezes" },
      { name: "Jog", href: "/jog" },
      { name: "Kivitelezés", href: "/kivitelezes" },
    ],
  },
  {
    title: "Eszközök",
    links: [
      { name: "Kalkulátorok", href: "/eszkozok" },
      { name: "Telek", href: "/telek" },
      { name: "GYIK", href: "/gyik" },
      { name: "Impresszum", href: "/kapcsolat" },
    ],
  },
];

export default function Footer() {
  return (
    <footer class="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50" f-client-nav={false}>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand column */}
          <div class="col-span-2 md:col-span-1">
            <a href="/" class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              </div>
              <span class="font-bold text-slate-900 dark:text-white">Házépítési Kalauz</span>
            </a>
            <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Független döntéstámogató tudástár családok számára, akik házépítésre készülnek.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <h3 class="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                {group.title}
              </h3>
              <ul class="space-y-2">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div class="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p class="text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} Házépítési Kalauz. Minden jog fenntartva.
          </p>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Független, objektív tartalom — nem vagyunk kivitelező vagy ingatlaniroda.
          </p>
        </div>
      </div>
    </footer>
  );
}
