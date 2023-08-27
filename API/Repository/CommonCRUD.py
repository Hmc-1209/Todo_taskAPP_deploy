from models import User, Repository, Task
from database import db
from fastapi import HTTPException, status

from Exceptions import not_found


async def check_user(user_id):
    stmt = User.select().where(User.c.user_id == user_id)
    user = await db.fetch_one(stmt)

    if not user:
        raise not_found("User")
    return user


async def check_repo(repo_id):
    stmt = Repository.select().where(Repository.c.repo_id == repo_id)
    origin_repo = await db.fetch_one(stmt)

    if not origin_repo:
        raise not_found("Repository")
    return origin_repo
