import CompanySidebar from "@/components/company/CompanySidebar";
import CompanyMobileNav from "@/components/company/CompanyMobileNav";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full bg-background text-foreground flex flex-row overflow-hidden font-sans">
        {/* Desktop sidebar — always visible, never remounts */}
        <div className="hidden md:block">
          <CompanySidebar />
        </div>

        <main className="flex-1 h-screen overflow-y-auto bg-background">
          {/* Mobile header + overlay handled in client component */}
          <CompanyMobileNav />
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
