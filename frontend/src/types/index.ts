export interface Evaluacion {
  id: string;
  docente_id: string;
  documento_id: string;
  periodo: string;
  puntaje_general: number | null;
  estado: "pendiente" | "procesando" | "completado" | "error";
  created_at: string;
  updated_at: string;
}

export interface Documento {
  id: string;
  nombre_archivo: string;
  estado: "subido" | "procesando" | "procesado" | "error";
  storage_path: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}
