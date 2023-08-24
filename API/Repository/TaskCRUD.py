from models import User, Repository, Task
from database import db
from fastapi import HTTPException, status
from schemas import DeleteTask, CreateTask, UpdateTask
from Repository.CommonCRUD import check_user, check_repo


async def get_tasks_by_user_id(user_id: int):
    """Get all the task belongs to user using user id"""

    await check_user(user_id)

    stmt = Task.select().where(Task.c.creator_id == user_id)
    tasks = await db.fetch_all(stmt)
    print(tasks)
    return tasks


async def get_tasks_by_repo_id(repo_id: int):
    """Get all the task belongs to specific repository"""

    await check_repo(repo_id)

    stmt = Task.select().where(Task.c.belongs_to_repository_id == repo_id)
    tasks = await db.fetch_all(stmt)
    print(tasks)
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
        belongs_to_repository_id=task.belongs_to_repository_id
    )

    result = await db.execute(stmt)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot create task.")

    return {"detail": "Success:Successfully created new task."}


async def update_task(task: UpdateTask):
    """Update the tasks's info"""

    await check_user(task.creator_id)
    await check_repo(task.belongs_to_repository_id)

    stmt = Task.update().values(
        task_name=task.task_name,
        task_description=task.task_description,
        task_due_date=task.task_due_date,
        task_finish=task.task_finish,
    ).where(Task.c.task_id == task.task_id)

    result = await db.execute(stmt)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot update task.",
        )

    return {"detail": "Success:Successfully updated selected task."}


async def delete_task(task: DeleteTask):
    """Deleting specific task"""

    await check_user(task.creator_id)

    stmt = Task.delete().where(Task.c.task_id == task.task_id)

    result = await db.execute(stmt)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete task.",
        )

    return {"detail": "Success:Successfully deleted the task."}
