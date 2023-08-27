from fastapi import HTTPException, status
from database import db

from models import Repository, Tag
from schemas import CreateTag, UpdateTag, DeleteTag
from Repository.CommonCRUD import check_user, check_repo
from Exceptions import not_found


async def get_tags_by_repo_id(repo_id: int):
    """Get the tags of specific repository"""

    await check_repo(repo_id)

    stmt = Tag.select().where(Tag.c.belongs_to_repository_id == repo_id)
    tags = await db.fetch_all(stmt)

    return tags


async def create_new_tag(tag: CreateTag):
    """Create new tag for specific reposiory"""

    await check_user(tag.creator_id)
    await check_repo(tag.belongs_to_repository_id)

    stmt = Tag.insert().values(
        tag_name=tag.tag_name,
        creator_id=tag.creator_id,
        belongs_to_repository_id=tag.belongs_to_repository_id,
    )

    result = await db.execute(stmt)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot create tag."
        )

    return {"detail": "Success:Successfully created tag"}


async def update_tag_info(tag: UpdateTag):
    """Check the tag existence and update the information"""

    stmt = Tag.select().where(Tag.c.tag_id == tag.tag_id)
    if not await db.fetch_one(stmt):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tag with corresponding id does not exist.",
        )

    stmt = Tag.update().values(tag_name=tag.tag_name).where(Tag.c.tag_id == tag.tag_id)
    if not await db.execute(stmt):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot update tag."
        )

    return {"detail": "Success:Successfully updated the tag.z"}


async def delete_spec_tag(tag: DeleteTag):
    """Delete the specific tag"""

    stmt = Tag.select().where(Tag.c.tag_id == tag.tag_id)
    if not await db.fetch_one(stmt):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tag with corresponding id does not exist.",
        )

    stmt = Tag.delete().where(Tag.c.tag_id == tag.tag_id)
    if not await db.execute(stmt):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot delete tag."
        )

    return {"detail": "Success:Successfully deleted the tag."}


async def find_tag_belongs_repo_creator(repo_id):
    stmt = Repository.select().where(Repository.c.repo_id == repo_id)
    repo = await db.fetch_one(stmt)

    if not repo:
        raise not_found("Repository")

    return repo.creator_id


async def find_tag_creator(tag_id):
    stmt = Tag.select().where(Tag.c.tag_id == tag_id)
    tag = await db.fetch_one(stmt)

    if not tag:
        raise not_found("Tag")

    return tag.creator_id
