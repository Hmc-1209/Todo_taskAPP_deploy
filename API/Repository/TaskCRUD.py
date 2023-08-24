from models import User, Repository, Task
from database import db
from fastapi import HTTPException, status
from schemas import BaseTask
from Repository.CommonCRUD import check_user


async def get_tasks_by_user_id(user_id: int):
    """Get all the task belongs to user using user id"""

    await check_user(user_id)

    stmt = Task.select().where(Task.c.creator_id == user_id)
    tasks = await db.fetch_all(stmt)
    print(tasks)
    return tasks
