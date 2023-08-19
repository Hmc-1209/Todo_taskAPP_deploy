from fastapi import APIRouter
from schemas import BaseTask, CreateTask, UpdateTask

router = APIRouter(
    prefix="/task",
    tags=["Task"]
)