import { useRef, useState } from "preact/hooks";

export default function ContactMe() {
  const form = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const sendEmail = async (e: Event) => {
    e.preventDefault();
    setSending(true);
    setStatus("idle");

    try {
      const emailjs = await import("npm:@emailjs/browser@3.11.0");
      await emailjs.default.sendForm(
        "service_0gd1e5o",
        "template_ef5lz0q",
        form.current!,
        "PzcQBDc6c2T1v5ss6",
      );
      form.current?.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div class="max-w-xl mx-auto">
      <p class="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
        Amennyiben bármilyen kérdésed van, vagy együttműködést szeretnél kezdeményezni, itt megteheted.
      </p>

      <form ref={form} onSubmit={sendEmail} class="space-y-5">
        <div>
          <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Email cím
          </label>
          <input
            type="email"
            id="email"
            name="user_email"
            placeholder="email@email.hu"
            required
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow"
          />
        </div>

        <div>
          <label for="subject" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Tárgy
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            placeholder="Érdeklődöm..."
            required
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow"
          />
        </div>

        <div>
          <label for="message" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Üzenet
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            placeholder="Szeretném visszajelezni, hogy..."
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow resize-y"
          />
        </div>

        <button
          type="submit"
          disabled={sending}
          class="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium rounded-xl shadow-lg shadow-primary-500/20 transition-colors"
        >
          {sending ? (
            <>
              <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Küldés...
            </>
          ) : "Küldés"}
        </button>
      </form>

      {/* Status messages */}
      {status === "success" && (
        <div class="mt-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
          <p class="text-sm font-medium text-emerald-800 dark:text-emerald-300">
            Üzenet sikeresen elküldve! Hamarosan felveszem veled a kapcsolatot.
          </p>
        </div>
      )}

      {status === "error" && (
        <div class="mt-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
          <p class="text-sm font-medium text-red-800 dark:text-red-300">
            Hiba történt az üzenet küldése közben. Kérlek, próbáld újra később.
          </p>
        </div>
      )}
    </div>
  );
}
