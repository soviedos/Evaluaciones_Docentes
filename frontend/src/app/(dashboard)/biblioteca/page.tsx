import type { Metadata } from "next";
import { Library } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Biblioteca",
};

export default function BibliotecaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Biblioteca</h2>
        <p className="text-muted-foreground">
          Repositorio de evaluaciones docentes procesadas y documentos
          asociados.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sin documentos</CardTitle>
          <CardDescription>
            La biblioteca se poblará automáticamente al procesar evaluaciones
            desde la sección de carga.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Library className="mb-4 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Los documentos procesados aparecerán aquí.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
