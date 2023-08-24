from fastapi import APIRouter
from schemas import BaseTask, CreateTask, UpdateTask, ReadTasksUsingUserId
from Repository.TaskCRUD import *

router = APIRouter(prefix="/task", tags=["Task"])


@router.get("/user_id/{user_id}")
async def get_tasks_using_user_id(user_id) -> ReadTasksUsingUserId:
    """The endpoint of getting all tasks using user id"""

    return await get_tasks_by_user_id(user_id)
