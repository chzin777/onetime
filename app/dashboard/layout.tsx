import Sidebar from "./_components/sidebar";
import Topbar from "./_components/topbar";
import BottomNav from "./_components/bottom-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <Topbar />
        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 max-w-7xl w-full mx-auto pb-28 lg:pb-8">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
