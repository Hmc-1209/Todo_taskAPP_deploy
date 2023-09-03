from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated

from schemas import UpdateTag, CreateTag, DeleteTag, UpdateUser
from Repository.TagCRUD import find_tag_belongs_repo_creator, get_tags_by_repo_id, create_new_tag, find_tag_creator, update_tag_info, delete_spec_tag
from Repository.CommonCRUD import check_user, check_repo
from Authentication.JWTtoken import get_current_user
from Exceptions import access_denied_not_allowed

router = APIRouter(prefix="/tag", tags=["Tag"])


@router.get("/repo_id/{id}")
async def get_tags_using_repo_id(repo_id: int, current_user: Annotated[UpdateUser, Depends(get_current_user)]) -> list[UpdateTag]:
    """The endpoint of reading all tags in specific repository"""

    if await find_tag_belongs_repo_creator(repo_id) != current_user.user_id:
        raise access_denied_not_allowed("read", "tags")

    return await get_tags_by_repo_id(repo_id)


@router.post("/create")
async def create_new_tag_in_repository(tag: CreateTag, current_user: Annotated[UpdateUser, Depends(get_current_user)]) -> None:
    """The endpoint of creating new tag in specific repository"""

    await check_user(tag.creator_id)
    await check_repo(tag.belongs_to_repository_id)

    if (tag.creator_id != current_user.user_id) or await find_tag_belongs_repo_creator(tag.belongs_to_repository_id) != current_user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Access denied. You are not allowed to create tag for other user.")

    return await create_new_tag(tag)


@router.put("/update")
async def update_tag(tag: UpdateTag, current_user: Annotated[UpdateUser, Depends(get_current_user)]) -> None:
    """The endpoint of updating specific tag"""

    if await find_tag_creator(tag.tag_id) != current_user.user_id:
        raise access_denied_not_allowed("update", "tag")

    return await update_tag_info(tag)


@router.delete("/delete")
async def dalete_tag(tag: DeleteTag, current_user: Annotated[UpdateUser, Depends(get_current_user)]) -> None:
    """The endpoint of deleting specific tag"""

    if await find_tag_creator(tag.tag_id) != current_user.user_id:
        raise access_denied_not_allowed("delete", "tag")

    return await delete_spec_tag(tag)
