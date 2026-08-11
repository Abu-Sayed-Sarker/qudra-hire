import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminTopbar />
          <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-background">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
