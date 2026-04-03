from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_evaluaciones():
    return {"evaluaciones": [], "total": 0}
