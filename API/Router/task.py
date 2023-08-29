from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated

from schemas import (
    UpdateUser,
    CreateTask,
    UpdateTask,
    DeleteTask,
    ReadTasksUsingUserId,
    ReadTasksUsingRepoId,
)
from Repository.TaskCRUD import get_tasks_by_user_id, get_tasks_by_repo_id, create_new_task, update_task_info, find_task_creator, delete_spec_task
from Repository.CommonCRUD import check_user, check_repo
from Authentication.JWTtoken import get_current_user
from Exceptions import access_denied_not_allowed

router = APIRouter(prefix="/task", tags=["Task"])


@router.get("/user_id/{id}")
async def get_tasks_using_user_id(user_id: int, current_user: Annotated[UpdateUser, Depends(get_current_user)]) -> list[ReadTasksUsingUserId]:
    """The endpoint of getting all tasks using user id"""

    await check_user(user_id)

    if user_id != current_user.user_id:
        raise access_denied_not_allowed("read", "tasks")

    return await get_tasks_by_user_id(user_id)


@router.get("/repo_id/{id}")
async def get_tasks_using_repo_id(repo_id: int, current_user: Annotated[UpdateUser, Depends(get_current_user)]) -> list[ReadTasksUsingRepoId]:
    """The endpoint of getting all tasks using repo id"""

    origin_repo = await check_repo(repo_id)

    if origin_repo.creator_id != current_user.user_id:
        raise access_denied_not_allowed("read", "tasks")

    return await get_tasks_by_repo_id(repo_id)


@router.post("/create")
async def create_task(task: CreateTask, current_user: Annotated[UpdateUser, Depends(get_current_user)]) -> None:
    """The endpoint of getting all tasks using repo_id"""

    await check_user(task.creator_id)
    repo = await check_repo(task.belongs_to_repository_id)

    if (task.creator_id != current_user.user_id) or repo.creator_id != current_user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Access denied. You are not allowed to create task for others.")

    return await create_new_task(task)


@router.put("/update")
async def update_specific_task(task: UpdateTask, current_user: Annotated[UpdateUser, Depends(get_current_user)]) -> None:
    """The endpoint of updating specific task"""

    repo = await check_repo(task.belongs_to_repository_id)

    if (task.creator_id != current_user.user_id) or repo.creator_id != current_user.user_id:
        raise access_denied_not_allowed("update", "tasks")

    return await update_task_info(task)


@router.delete("/delete")
async def delete_task(task: DeleteTask, current_user: Annotated[UpdateUser, Depends(get_current_user)]) -> None:
    """The endpoint of deleting specific task"""

    if await find_task_creator(task.task_id) != current_user.user_id:
        raise access_denied_not_allowed("delete", "tasks")

    return await delete_spec_task(task)
