from fastapi import APIRouter
from schemas import (
    BaseTask,
    CreateTask,
    UpdateTask,
    ReadTasksUsingUserId,
    ReadTasksUsingRepoId,
)
from Repository.TaskCRUD import *

router = APIRouter(prefix="/task", tags=["Task"])


@router.get("/user_id/{user_id}")
async def get_tasks_using_user_id(user_id: int) -> list[ReadTasksUsingUserId]:
    """The endpoint of getting all tasks using user id"""

    return await get_tasks_by_user_id(user_id)


@router.get("/repo_id/{repo_id}")
async def get_tasks_using_repo_id(repo_id: int) -> list[ReadTasksUsingRepoId]:
    """The endpoint of getting all tasks using repo_id"""

    return await get_tasks_by_repo_id(repo_id)


@router.post("/create")
async def create_task(task: CreateTask) -> None:
    """The endpoint of getting all tasks using repo_id"""

    return await create_new_task(task)


@router.put("/update")
async def update_specific_task(task: UpdateTask) -> None:
    """The endpoint of updating specific task"""

    return await update_task_info(task)


@router.delete("/delete")
async def delete_task(task: DeleteTask) -> None:
    """The endpoint of deleting specific task"""

    return await delete_spec_task(task)
