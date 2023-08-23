from fastapi import APIRouter
from schemas import BaseUser, CreateUser, UpdateUser, DeleteUser
from Repository.UserCRUD import *

router = APIRouter(prefix="/user", tags=["User"])


@router.get("/id/{id}")
async def read_user_with__corresponding_id(user_id) -> UpdateUser:
    """The router of getting specific user's info by user_id"""

    return await get_spec_user_by_id(user_id)


@router.get("/name/{name}")
async def read_user_with_corresponding_name(user_name) -> UpdateUser:
    """The router of getting specific user's info by user_name"""

    return await get_spec_user_by_name(user_name)


@router.get("/")
async def read_all_user() -> list[UpdateUser]:
    """The router of getting all users' info"""

    return await get_all_user()


@router.post("/create")
async def create_user(user: CreateUser) -> None:
    """The router of creating a user"""

    return await create_new_user(user)


@router.put("/update_info")
async def update_user(user: UpdateUser) -> None:
    """The router of updating a user's info"""

    return await update_user_info(user)


@router.delete("/delete")
async def delete_user(user: DeleteUser) -> None:
    """The router of deleting a user"""

    return await delete_spec_user(user)
