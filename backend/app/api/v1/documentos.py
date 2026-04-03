from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_documentos():
    return {"documentos": [], "total": 0}
