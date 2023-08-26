from fastapi import APIRouter, Depends
from typing import Annotated
from schemas import BaseUser, CreateUser, UpdateUser, DeleteUser, ShowUserId
from Repository.UserCRUD import *
from Authentication.JWTtoken import get_current_user


router = APIRouter(prefix="/user", tags=["User"])


@router.get("/id/{id}")
async def read_user_with__corresponding_id(user_id: int, current_user: Annotated[UpdateUser, Depends(get_current_user)]) -> UpdateUser:
    """The endpoint of getting specific user's info by user_id"""

    return await get_spec_user_by_id(user_id)


@router.get("/name/{name}")
async def read_user_id_with_corresponding_name(user_name: str) -> ShowUserId:
    """The endpoint of getting specific user's info by user_name"""

    return await get_spec_user_id_by_name(user_name)


@router.get("/")
async def read_all_user() -> list[UpdateUser]:
    """The endpoint of getting all users' info"""

    return await get_all_user()


@router.post("/create")
async def create_user(user: CreateUser) -> None:
    """The endpoint of creating a user"""

    return await create_new_user(user)


@router.put("/update_info")
async def update_user(user: UpdateUser) -> None:
    """The endpoint of updating a user's info"""

    return await update_user_info(user)


@router.delete("/delete")
async def delete_user(user: DeleteUser) -> None:
    """The endpoint of deleting a user"""

    return await delete_spec_user(user)
