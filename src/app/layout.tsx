import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { profile } from "@/content/profile";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-grotesk", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-jetbrains", display: "swap" });

const id = profile.identity;
const title = `${id.fullName} · Mobile Engineer`;
const description =
  "Ashwin Shrestha is a Senior Mobile Engineer in Kathmandu building Flutter and Kotlin apps for banking, e-learning, e-commerce and workforce management.";

export const metadata: Metadata = {
  // Set NEXT_PUBLIC_SITE_URL once the domain is chosen; it enables canonical and og:url.
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
  alternates: process.env.NEXT_PUBLIC_SITE_URL ? { canonical: "/" } : undefined,
  title,
  description,
  authors: [{ name: id.fullName }],
  openGraph: {
    type: "website",
    title,
    description: "Flutter and Kotlin apps that keep working when the network doesn't. Explore the portfolio as an operating system."
  },
  twitter: { card: "summary" }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fbf3e6"
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: id.fullName,
  jobTitle: id.roles[0],
  address: { "@type": "PostalAddress", addressLocality: "Kathmandu", addressCountry: "NP" },
  alumniOf: "The British College, Kathmandu",
  knowsAbout: ["Flutter", "Dart", "Kotlin", "Jetpack Compose", "React Native", "Offline-first mobile apps"],
  sameAs: profile.socials.map((s) => s.url)
};

/* Applies the saved (or system) theme before first paint to avoid a flash. */
const themeScript = `(function(){try{var t=JSON.parse(localStorage.getItem("personal-os-theme-v1"));if(t!=="day"&&t!=="night"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"day"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="day"}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="day" suppressHydrationWarning className={`${inter.variable} ${grotesk.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        {children}
        <noscript>
          <div className="noscript">
            <h1>{id.fullName} — Senior Mobile Engineer</h1>
            <p>Flutter and Kotlin apps for banking, e-learning, e-commerce and workforce management. Kathmandu, Nepal.</p>
            <p>
              Email: <a href={`mailto:${profile.conversion.email}`}>{profile.conversion.email}</a> ·{" "}
              {profile.socials.map((s) => (
                <span key={s.url}>
                  <a href={s.url}>{s.network}</a> ·{" "}
                </span>
              ))}
              <a href={id.resumeUrl}>Résumé (PDF)</a>
            </p>
          </div>
        </noscript>
      </body>
    </html>
  );
}
