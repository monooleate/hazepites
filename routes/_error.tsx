import { HttpError, type PageProps } from "fresh";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";

export default function ErrorPage(props: PageProps) {
  const error = props.error;
  const is404 = error instanceof HttpError && error.status === 404;

  return (
    <div class="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Header />
      <main class="flex-1 flex items-center justify-center px-4">
        <div class="text-center max-w-md">
          <div class="text-8xl font-bold text-slate-200 dark:text-slate-700 mb-4">
            {is404 ? "404" : "Hiba"}
          </div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            {is404 ? "Az oldal nem található" : "Valami hiba történt"}
          </h1>
          <p class="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            {is404
              ? "A keresett oldal nem létezik, vagy áthelyezésre került. Ellenőrizd az URL-t, vagy térj vissza a főoldalra."
              : "Kérjük, próbáld újra később. Ha a probléma tartós, vedd fel velünk a kapcsolatot."}
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/25 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              Vissza a főoldalra
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
