from fastapi import APIRouter
from schemas import UpdateTag, CreateTag, DeleteTag
from Repository.TagCRUD import *

router = APIRouter(prefix="/tag", tags=["Tag"])


@router.get("/repo_id/{repo_id}")
async def get_tags_using_repo_id(repo_id: int) -> list[UpdateTag]:
    """The endpoint of reading all tags in specific repository"""

    return await get_tags_by_repo_id(repo_id)


@router.post("/create")
async def create_new_tag_in_repository(tag: CreateTag) -> None:
    """The endpoint of creating new tag in specific repository"""

    return await create_new_tag(tag)


@router.put("/update")
async def update_tag(tag: UpdateTag) -> None:
    """The endpoint of updating specific tag"""

    return await update_tag_info(tag)


@router.delete("/delete")
async def dalete_tag(tag: DeleteTag) -> None:
    """The endpoint of deleting specific tag"""

    return await delete_spec_tag(tag)
