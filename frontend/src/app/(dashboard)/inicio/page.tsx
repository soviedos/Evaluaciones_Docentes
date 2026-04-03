import type { Metadata } from "next";
import { Home } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Inicio",
};

export default function InicioPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Inicio</h2>
        <p className="text-muted-foreground">
          Resumen general del sistema de evaluaciones docentes.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Documentos", value: "—" },
          { label: "Evaluaciones", value: "—" },
          { label: "Docentes", value: "—" },
          { label: "Promedio general", value: "—" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardDescription>{stat.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bienvenido</CardTitle>
          <CardDescription>
            Plataforma interna para el análisis de evaluaciones docentes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Home className="mb-4 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Usa el menú lateral para navegar entre las secciones del sistema.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
