import Link from "next/link";

const navItems = [
  { href: "/dashboard/evaluaciones", label: "Evaluaciones" },
  { href: "/dashboard/carga", label: "Cargar PDFs" },
  { href: "/dashboard/reportes", label: "Reportes" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h1 className="text-xl font-bold mb-8">Evaluaciones Docentes</h1>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
}
