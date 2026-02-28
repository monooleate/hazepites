import { useRef, useState } from "preact/hooks";

export default function ContactMe() {
  const form = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const sendMessage = async (e: Event) => {
    e.preventDefault();
    setSending(true);
    setStatus("idle");
    setErrorMsg("");

    const fd = new FormData(form.current!);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fd.get("email"),
          subject: fd.get("subject"),
          message: fd.get("message"),
          website: fd.get("website"), // honeypot
        }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        form.current?.reset();
        // Redirect to thank-you page
        globalThis.location.href = "/koszonjuk";
        return;
      } else {
        setStatus("error");
        setErrorMsg(data.error ?? "Ismeretlen hiba történt.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Hálózati hiba. Ellenőrizd az internetkapcsolatod.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div class="max-w-xl mx-auto">
      <p class="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
        Kérdésed van, vagy együttműködést szeretnél? Írj nekünk — általában 1-2 munkanapon belül válaszolunk.
      </p>

      <form ref={form} onSubmit={sendMessage} class="space-y-5">
        {/* Honeypot — hidden from real users, bots fill it */}
        <div class="absolute opacity-0 h-0 w-0 overflow-hidden" aria-hidden="true" tabIndex={-1}>
          <label>Ne töltsd ki
            <input type="text" name="website" tabIndex={-1} autocomplete="off" />
          </label>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Email cím
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="neved@email.hu"
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
            placeholder="Miben segíthetünk?"
            required
            minLength={2}
            maxLength={200}
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
            placeholder="Írd le a kérdésed vagy javaslatod..."
            required
            minLength={10}
            maxLength={5000}
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow resize-y"
          />
        </div>

        <button
          type="submit"
          disabled={sending}
          class="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium rounded-xl shadow-lg shadow-primary-500/20 transition-colors cursor-pointer disabled:cursor-wait"
        >
          {sending
            ? (
              <>
                <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Küldés...
              </>
            )
            : (
              <>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
                Üzenet küldése
              </>
            )}
        </button>
      </form>

      {/* Status messages */}
      {status === "success" && (
        <div class="mt-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
          <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm font-medium text-emerald-800 dark:text-emerald-300">
            Üzenet elküldve! 1-2 munkanapon belül válaszolunk.
          </p>
        </div>
      )}

      {status === "error" && (
        <div class="mt-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex items-start gap-3">
          <svg class="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p class="text-sm font-medium text-red-800 dark:text-red-300">
            {errorMsg || "Hiba történt. Próbáld újra később."}
          </p>
        </div>
      )}
    </div>
  );
}
