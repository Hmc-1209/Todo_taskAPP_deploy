from database import db
from fastapi import HTTPException, status

from models import Repository
from schemas import CreateRepository, UpdateRepository
from Repository.CommonCRUD import check_user


async def get_user_repositories(user_id: int):
    """Read out all repositories created by the user"""

    await check_user(user_id)

    stmt = Repository.select().where(Repository.c.creator_id == user_id)

    repos = await db.fetch_all(stmt)

    return repos


async def create_new_repository(new_repo: CreateRepository):
    """Create the new repository for user"""

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

    stmt = (
        Repository.update()
        .values(repo_name=repo.repo_name)
        .where(Repository.c.repo_id == repo.repo_id)
    )

    try:
        await db.execute(stmt)

    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot update repository."
        )

    return {"detail": "Success:Successfully updated the repository."}


async def delete_spec_repository(repo: UpdateRepository):
    """Delete the specific repository"""

    stmt = Repository.delete().where(Repository.c.repo_id == repo.repo_id)
    if not await db.execute(stmt):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot delete repository."
        )

    return {"detail": "Success:Successfully deleted the repository."}
