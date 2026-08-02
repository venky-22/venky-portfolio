import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Venkateshwaran Mohan — Portfolio",
  description:
    "Portfolio of Venkateshwaran Mohan — Software Engineer and Machine Learning Enthusiast. Published researcher with experience at Oracle, ELGI, Kaar, and Cisco.",
  openGraph: {
    title: "Venkateshwaran Mohan — Portfolio",
    description:
      "Software Engineer and Machine Learning Enthusiast. Published researcher with experience at Oracle, ELGI, Kaar, and Cisco.",
    url: "https://venkateshwaran.dev",
    siteName: "Venkateshwaran Mohan",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Venkateshwaran Mohan — Portfolio",
    description:
      "Software Engineer and Machine Learning Enthusiast. Published researcher with experience at Oracle, ELGI, Kaar, and Cisco.",
  },
  metadataBase: new URL("https://venkateshwaran.dev"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} dark`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(){try{var d=document.documentElement,c=d.classList;c.remove("light","dark");var e=localStorage.getItem("theme");if("system"===e||!e){var t="(prefers-color-scheme: dark)",m=window.matchMedia(t);if(m.media!==t||m.matches){d.style.colorScheme="dark";c.add("dark")}else{d.style.colorScheme="light";c.add("light")}}else{c.add(e)}if(e)d.style.colorScheme=e}catch(e){}}()`,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased max-w-2xl mx-auto py-12 sm:py-24 px-6">
        {children}
        <Script
          defer
          data-domain="venkateshwaran.dev"
          src="https://plausible.io/js/script.js"
        />
      </body>
    </html>
  );
}
