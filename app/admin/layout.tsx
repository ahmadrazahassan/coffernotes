import { AdminHeader } from "@/components/layout/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans antialiased selection:bg-neutral-200">
      <AdminHeader />
      <main className="pt-28 pb-16 px-6 md:px-10 lg:px-12 w-full max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  );
}
