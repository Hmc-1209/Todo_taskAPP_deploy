from models import User, Repository
from database import db
from fastapi import HTTPException, status

user_not_found = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="User with corresponding id does not exist.",
)

repo_not_found = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Repository with corresponding id does not exist.",
)


async def check_user(user_id):
    stmt = User.select().where(User.c.user_id == user_id)
    user = await db.fetch_one(stmt)

    if not user:
        raise user_not_found


async def check_repo(repo_id):
    stmt = Repository.select().where(Repository.c.repo_id == repo_id)
    origin_repo = await db.fetch_one(stmt)

    if not origin_repo:
        raise repo_not_found
