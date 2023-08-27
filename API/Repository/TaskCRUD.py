from models import User, Repository, Task
from database import db
from fastapi import HTTPException, status
from schemas import DeleteTask, CreateTask, UpdateTask
from Repository.CommonCRUD import check_user, check_repo
from Exceptions import not_found


async def get_tasks_by_user_id(user_id: int):
    """Get all the task belongs to user using user id"""

    await check_user(user_id)

    stmt = Task.select().where(Task.c.creator_id == user_id)
    tasks = await db.fetch_all(stmt)

    return tasks


async def get_tasks_by_repo_id(repo_id: int):
    """Get all the task belongs to specific repository"""

    stmt = Task.select().where(Task.c.belongs_to_repository_id == repo_id)
    tasks = await db.fetch_all(stmt)

    return tasks


async def create_new_task(task: CreateTask):
    """Create new task for specific repo with specific user id"""

    await check_user(task.creator_id)
    await check_repo(task.belongs_to_repository_id)

    stmt = Task.insert().values(
        task_name=task.task_name,
        task_description=task.task_description,
        task_due_date=task.task_due_date,
        task_finish=task.task_finish,
        creator_id=task.creator_id,
        belongs_to_repository_id=task.belongs_to_repository_id,
    )

    result = await db.execute(stmt)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot create task."
        )

    return {"detail": "Success:Successfully created new task."}


async def update_task_info(task: UpdateTask):
    """Update the tasks's info"""

    await check_user(task.creator_id)
    await check_repo(task.belongs_to_repository_id)

    stmt = Task.select().where(Task.c.task_id == task.task_id)
    origin_task = await db.fetch_one(stmt)

    if not origin_task:
        raise not_found("Task")

    if origin_task.creator_id != task.creator_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Access denied. You are not allowed to update task for others.")

    if origin_task.belongs_to_repository_id != task.belongs_to_repository_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Action failed. Wrong repository id with corresponding task.")

    stmt = (
        Task.update()
        .values(
            task_name=task.task_name,
            task_description=task.task_description,
            task_due_date=task.task_due_date,
            task_finish=task.task_finish,
        )
        .where(Task.c.task_id == task.task_id)
    )

    result = await db.execute(stmt)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot update task.",
        )

    return {"detail": "Success:Successfully updated selected task."}


async def delete_spec_task(task: DeleteTask):
    """Deleting specific task"""

    stmt = Task.delete().where(Task.c.task_id == task.task_id)

    result = await db.execute(stmt)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete task.",
        )

    return {"detail": "Success:Successfully deleted the task."}


async def find_task_creator(task_id):

    stmt = Task.select().where(Task.c.task_id == task_id)
    task = await db.fetch_one(stmt)

    if not task:
        raise not_found("Task")

    return task.creator_id
