import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Consultas IA",
};

export default function ConsultasIaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Consultas IA</h2>
        <p className="text-muted-foreground">
          Realiza preguntas en lenguaje natural sobre las evaluaciones docentes.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Asistente inteligente</CardTitle>
          <CardDescription>
            Usa el modelo Gemini para consultar y analizar la información
            recopilada de las evaluaciones.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Sparkles className="mb-4 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Escribe una pregunta para obtener insights de las evaluaciones.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
