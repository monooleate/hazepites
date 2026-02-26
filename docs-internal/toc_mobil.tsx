      {/* Mobile toolbar — unified: menu + szolgáltatások + TOC + dark toggle */}
      <div class="md:hidden sticky top-0 z-50 bg-white/85 dark:bg-gray-900/85 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700" f-client-nav={false}>
        <div class="flex items-center justify-between h-14 px-2">
          {/* Left — Sidebar toggle */}
          <label
            for="docs_sidebar"
            class="p-2 flex items-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg gap-1.5 cursor-pointer"
          >
            <svg class="h-5 w-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            <span class="text-sm font-medium">Menü</span>
          </label>

          {/* Center — Szolgáltatások dropdown */}
          <div class="relative" id="mobile-docs-szolg-wrapper">
            <input type="checkbox" id="mobile-docs-szolg-toggle" class="hidden peer" />
            <label
              for="mobile-docs-szolg-toggle"
              class="flex items-center gap-1 px-2 py-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
            >
              Szolg.
              <svg class="w-3.5 h-3.5 transition-transform peer-checked:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </label>
            <div class="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-56 z-50 hidden peer-checked:block">
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2">
                <a href="/szolgaltatasok" class="block px-4 py-2.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors">
                  Összes szolgáltatás
                </a>
                <hr class="my-1 border-gray-200 dark:border-gray-700" />
                {SZOLGALTATAS_ITEMS.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    class="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* TOC */}
          <div class="flex-shrink-0">
            <Partial name="toc">
              <aside>
                <TableOfContents headings={headings} />
              </aside>
            </Partial>
          </div>

          {/* Right — ThemeToggle */}
          <div class="flex-shrink-0">
            <ThemeToggle />
          </div>
        </div>
      </div>