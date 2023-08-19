from fastapi import APIRouter
from schemas import BaseRepository, CreateRepository, UpdateRepository

router = APIRouter(
    prefix="/repository",
    tags=["Repository"]
)