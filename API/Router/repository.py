from fastapi import APIRouter, Depends
from typing import Annotated
from schemas import UpdateRepository, CreateRepository, UpdateUser
from Repository.RepoCRUD import *
from Authentication.JWTtoken import get_current_user

router = APIRouter(prefix="/repository", tags=["Repository"])


@router.get("/user_id/{user_id}")
async def get_repos(user_id: int, current_user: Annotated[UpdateUser, Depends(get_current_user)]) -> list[UpdateRepository]:
    """The endpoint of getting the user's repositories"""

    if user_id != current_user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Access denied, you are not allowed to read repository from other user.")

    return await get_user_repositories(user_id)


@router.post("/create")
async def create_repo(new_repo: CreateRepository, current_user: Annotated[UpdateUser, Depends(get_current_user)]) -> None:
    """The endpoint of getting the user's repositories"""

    if new_repo.creator_id != current_user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Access denied, you are not allowed to create repository for other user.")

    return await create_new_repository(new_repo)


@router.put("/update")
async def update_repo(repo: UpdateRepository, current_user: Annotated[UpdateUser, Depends(get_current_user)]) -> None:
    """The endpoint of updating repository"""

    origin_repo = await check_repo(repo.repo_id)

    if origin_repo.creator_id != current_user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Access denied, you are not allowed to update repository for other user.")

    return await update_repository_info(repo)


@router.delete("/delete")
async def delete_repo(repo: UpdateRepository, current_user: Annotated[UpdateUser, Depends(get_current_user)]) -> None:
    """The endpoint of deleting repository"""

    origin_repo = await check_repo(repo.repo_id)

    if origin_repo.creator_id != current_user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Access denied, you are not allowed to create repository for other user.")

    return await delete_spec_repository(repo)
