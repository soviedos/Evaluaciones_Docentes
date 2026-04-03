import { apiClient, ApiClientError } from "@/lib/api-client";
import type { DocumentoUploadResponse } from "@/types";

export async function uploadDocument(
  file: File,
): Promise<DocumentoUploadResponse> {
  return apiClient.upload<DocumentoUploadResponse>(
    "/api/v1/documentos/upload",
    file,
  );
}

export { ApiClientError };
