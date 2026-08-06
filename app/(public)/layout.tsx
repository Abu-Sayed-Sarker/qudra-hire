import React from "react";
import QudraHeader from "@/components/layout/QudraHeader";
import QudraFooter from "@/components/layout/QudraFooter";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <QudraHeader />
      <main id="main-content" className="flex-1">{children}</main>
      <QudraFooter />
      <MobileBottomNav />
    </>
  );
}
