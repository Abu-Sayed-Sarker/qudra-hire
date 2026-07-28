import CandidateSidebar from "@/components/candidate/CandidateSidebar";
import CandidateMobileNav from "@/components/candidate/CandidateMobileNav";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full bg-background text-foreground flex flex-row overflow-hidden font-sans">
        {/* Desktop sidebar — always visible, never remounts */}
        <div className="hidden md:block">
          <CandidateSidebar />
        </div>

        <main className="flex-1 h-screen flex flex-col bg-background overflow-hidden">
          {/* Mobile header + overlay handled in client component */}
          <CandidateMobileNav />
          <div className="flex-1 w-full overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
