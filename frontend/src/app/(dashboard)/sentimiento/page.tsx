import type { Metadata } from "next";
import { Heart } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Análisis de sentimiento",
};

export default function SentimientoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Análisis de sentimiento
        </h2>
        <p className="text-muted-foreground">
          Percepción cualitativa extraída de los comentarios en las
          evaluaciones.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sin análisis</CardTitle>
          <CardDescription>
            El análisis de sentimiento se ejecuta a partir de los comentarios
            textuales procesados por IA.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Heart className="mb-4 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Los resultados de sentimiento aparecerán aquí.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
