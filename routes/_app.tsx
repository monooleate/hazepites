import { asset } from "fresh/runtime";
import { define } from "../utils/state.ts";

export default define.page(function App({ Component, state, url }) {
  const isContentPage = url.pathname.split("/").filter(Boolean).length > 0 && url.pathname !== "/kapcsolat";

  return (
    <html lang="hu" class="scroll-smooth">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="48x48" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#6366f1" />

        {/* Theme flash prevention */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}})();`,
          }}
        />

        {state.title
          ? <title>{state.title}</title>
          : <title>Házépítési Kalauz | Független útmutató házépítőknek</title>}
        {state.description
          ? <meta name="description" content={state.description} />
          : <meta name="description" content="Készülsz házat építeni? Objektív összehasonlítások, költségkalkulátorok és szakértői útmutatók." />}
        {state.keywords && <meta name="keywords" content={state.keywords} />}
        {state.title && <meta property="og:title" content={state.title} />}
        {state.description && <meta property="og:description" content={state.description} />}
        <meta property="og:type" content="website" />
        {state.cleanUrl && <meta property="og:url" content={state.cleanUrl} />}
        <meta property="og:locale" content="hu_HU" />
        <meta property="og:site_name" content="Házépítési Kalauz" />
        {state.ogImage && <meta property="og:image" content={state.ogImage} />}
        {state.ogImage && <meta property="og:image:width" content="1200" />}
        {state.ogImage && <meta property="og:image:height" content="630" />}

        {/* Twitter Card */}
        <meta name="twitter:card" content={state.ogImage ? "summary_large_image" : "summary"} />
        {state.title && <meta name="twitter:title" content={state.title} />}
        {state.description && <meta name="twitter:description" content={state.description} />}
        {state.ogImage && <meta name="twitter:image" content={state.ogImage} />}

        {state.noIndex && <meta name="robots" content="noindex" />}
        {state.cleanUrl && <link rel="canonical" href={state.cleanUrl} />}

        {/* Font preload removed: @font-face in styles.css (Vite pipeline) handles font loading.
            The old <link rel=preload> URL diverges from Vite's hashed CSS url(), causing
            "preloaded but not used" console warnings. font-display:swap is sufficient. */}

        {isContentPage && (
          <>
            <link rel="stylesheet" href={asset("/markdown.css")} />
            <link rel="stylesheet" href={asset("/prism.css")} />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css" crossorigin="anonymous" />
          </>
        )}

        {/* styles.css is imported via client.ts → Vite injects it automatically */}

        {state.articleSchema && <script type="application/ld+json" id="Article" dangerouslySetInnerHTML={{ __html: state.articleSchema }} />}
        {state.faqPageSchema && <script type="application/ld+json" id="FAQ" dangerouslySetInnerHTML={{ __html: state.faqPageSchema }} />}
        {state.howToSchema && <script type="application/ld+json" id="HowTo" dangerouslySetInnerHTML={{ __html: state.howToSchema }} />}
        {state.softwareSchema && <script type="application/ld+json" id="Software" dangerouslySetInnerHTML={{ __html: state.softwareSchema }} />}
        {state.mainSchema && <script type="application/ld+json" id="Main" dangerouslySetInnerHTML={{ __html: state.mainSchema }} />}
        {state.breadcrumbSchema && <script type="application/ld+json" id="BreadCrumb" dangerouslySetInnerHTML={{ __html: state.breadcrumbSchema }} />}
      </head>
      <body class="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased">
        <Component />
        {/* Click-outside bezárás + link-kattintás bezárás: TOC dropdown + mobil sidebar */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.addEventListener('click',function(e){var t=document.getElementById('header-toc-toggle');if(t&&t.checked){var w=document.getElementById('header-toc-wrapper');if(w&&!w.contains(e.target))t.checked=false;if(e.target.closest&&e.target.closest('#header-toc-panel a'))t.checked=false}});`,
          }}
        />
      </body>
    </html>
  );
});
