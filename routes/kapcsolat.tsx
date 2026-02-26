import { page } from "fresh";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import { define } from "../utils/state.ts";
import ContactMe from "../islands/ContactMe.tsx";

export const handler = define.handlers({
  GET(ctx) {
    ctx.state.title = "Impresszum – Házépítési Kalauz";
    ctx.state.description = "Kapcsolatfelvétel a Házépítési Kalauz oldallal és egyéb hasznos információk.";
    ctx.state.cleanUrl = "https://hazepitesikalauz.hu/kapcsolat";
    return page({});
  },
});

export default define.page<typeof handler>(function KapcsolatPage() {
  return (
    <div class="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Header />
      <main class="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12">
        <h1 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-8">
          Impresszum
        </h1>
        <div class="prose-custom">
          <ContactMe />
        </div>
      </main>
      <Footer />
    </div>
  );
});
