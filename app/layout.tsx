import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import StoreProvider from "@/components/layout/StoreProvider";
import { Toaster } from "@/components/ui/sonner";
import TranslationEngine from "@/components/shared/TranslationEngine";

const geistSans = Geist({

  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "CareerSprint - Find your next role",
  description: "CareerSprint is a job portal that connects job seekers with curated openings across the GCC. Find your next role and take the next step in your career.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // dir="ltr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        {/* Theme initialisation – runs before React hydrates to prevent flash */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("careersprint-theme"),r=t==="dark"||(!t&&matchMedia("(prefers-color-scheme:dark)").matches)?"dark":"light";document.documentElement.classList.add(r);document.documentElement.style.colorScheme=r}catch(e){}`,
          }}
        />
        {/* Language / RTL initialisation – runs before React hydrates to prevent layout flicker */}
        {/* <Script
          id="lang-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `try{
  var _lang="en",_dir="ltr";
  var _cookie=document.cookie.match(/(?:^|; )googtrans=([^;]+)/);
  if(_cookie&&decodeURIComponent(_cookie[1]).endsWith("/ar")){_lang="ar";_dir="rtl";}
  else{var _ls=localStorage.getItem("qh-lang");if(_ls==="ar"){_lang="ar";_dir="rtl";}}
  document.documentElement.setAttribute("lang",_lang);
  document.documentElement.setAttribute("dir",_dir);
}catch(e){}`,
          }}
        /> */}
      </head>
      <body className="min-h-full flex flex-col bg-black text-foreground pb-16 md:pb-0">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-9999 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold">
          Skip to main content
        </a>
        <StoreProvider>
          <ThemeProvider defaultTheme="dark" storageKey="careersprint-theme">
            {/* TranslationEngine: invisible, global — re-triggers Google Translate on every route change, including /login and /signup */}
            <TranslationEngine />
            {children}
            <Toaster />
          </ThemeProvider>
        </StoreProvider>
      </body >
    </html >
  );
}
