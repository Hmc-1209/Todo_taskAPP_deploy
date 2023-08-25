from fastapi import APIRouter
from schemas import BaseRepository, CreateRepository
from Repository.RepoCRUD import *

router = APIRouter(prefix="/repository", tags=["Repository"])


@router.get("/user_id/{user_id}")
async def get_repos(user_id: int) -> list[UpdateRepository]:
    """The endpoint of getting the user's repositories"""

    return await get_user_repositories(user_id)


@router.post("/create")
async def create_repo(new_repo: CreateRepository) -> None:
    """The endpoint of getting the user's repositories"""

    return await create_new_repository(new_repo)


@router.put("/update")
async def update_repo(repo: UpdateRepository) -> None:
    """The endpoint of updating repository"""

    return await update_repository_info(repo)


@router.delete("/delete")
async def delete_repo(repo: UpdateRepository) -> None:
    """The endpoint of deleting repository"""

    return await delete_spec_repository(repo)
