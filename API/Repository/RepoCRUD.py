from models import Repository, User
from database import db
from fastapi import HTTPException, status
from schemas import CreateRepository, UpdateRepository


async def get_user_repositories(user_id: int):
    """Read out all repositories created by the user"""

    stmt = Repository.select().where(Repository.c.creator_id == user_id)

    return await db.fetch_all(stmt)


async def create_new_repository(new_repo: CreateRepository):
    """Create the new repository for user"""

    stmt = User.select().where(User.c.user_id == new_repo.creator_id)
    user = await db.fetch_one(stmt)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User with corresponding id does not exist.",
        )

    stmt = Repository.insert().values(
        repo_name=new_repo.repo_name, creator_id=new_repo.creator_id
    )

    if not await db.execute(stmt):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot create repository.",
        )

    return {"detail": "Success:Successfully created new repository."}


async def update_repository_info(repo: UpdateRepository):
    """Updating the repository info"""

    stmt = Repository.select().where(Repository.c.repo_id == repo.repo_id)
    origin_repo = await db.fetch_one(stmt)

    if not origin_repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Repository with corresponding id does not exist.",
        )

    stmt = (
        Repository.update()
        .values(repo_name=repo.repo_name)
        .where(Repository.c.repo_id == repo.repo_id)
    )

    result = await db.execute(stmt)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot update repository."
        )

    return {"detail": "Success:Successfully updated the repository."}


async def delete_repository(repo: UpdateRepository):
    """Delete the specific repository"""

    stmt = Repository.select().where(Repository.c.repo_id == repo.repo_id)
    origin_repo = await db.fetch_one(stmt)

    if not origin_repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Repository with corresponding id does not exist.",
        )

    stmt = Repository.delete().where(Repository.c.repo_id == repo.repo_id)
    if not await db.execute(stmt):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot delete repository."
        )

    return {"detail": "Success:Successfully deleted the repository."}
