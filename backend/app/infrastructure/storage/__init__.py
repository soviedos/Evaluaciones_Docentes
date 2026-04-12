"""Re-export barrel — storage from shared."""
from app.shared.infrastructure.storage.file_storage import FileStorage, MinioFileStorage
from app.shared.infrastructure.storage.minio_client import ensure_bucket_exists, get_minio_client

__all__ = ["FileStorage", "MinioFileStorage", "ensure_bucket_exists", "get_minio_client"]
