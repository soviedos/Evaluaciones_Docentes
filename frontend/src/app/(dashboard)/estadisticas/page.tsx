import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Análisis estadístico",
};

export default function EstadisticasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Análisis estadístico
        </h2>
        <p className="text-muted-foreground">
          Métricas cuantitativas, tendencias y distribuciones de puntajes.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sin datos</CardTitle>
          <CardDescription>
            Los análisis estadísticos se generan a partir de evaluaciones
            procesadas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BarChart3 className="mb-4 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Los gráficos y métricas aparecerán aquí cuando haya evaluaciones.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
