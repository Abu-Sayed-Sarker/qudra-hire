import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QudraHire — AI-Powered Hiring for the GCC",
  description:
    "QudraHire is the AI recruitment platform for intelligent hiring: predictive candidate matching, resume intelligence, ATS optimization, and GCC compliance built for the future of work.",
  openGraph: {
    title: "QudraHire — AI-Powered Hiring for the GCC",
    description:
      "QudraHire is the AI recruitment platform for intelligent hiring: predictive candidate matching, resume intelligence, ATS optimization, and GCC compliance built for the future of work.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function Home2Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
