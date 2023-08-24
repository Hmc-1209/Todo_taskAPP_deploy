from fastapi import APIRouter
from schemas import BaseTag, CreateTag

router = APIRouter(prefix="/tag", tags=["Tag"])
