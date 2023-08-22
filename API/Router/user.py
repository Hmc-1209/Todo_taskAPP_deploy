from fastapi import APIRouter
from schemas import BaseUser, CreateUser, UpdateUser
from Repository.UserCRUD import *

router = APIRouter(
    prefix="/user",
    tags=["User"]
)

@router.get("/id/{id}")
async def read_user(user_id) -> UpdateUser:
    ''' The router of getting specific user's info by user_id '''

    return await get_spec_user_by_id(user_id)


@router.get("/name/{name}")
async def read_user(user_name) -> UpdateUser:
    ''' The router of getting specific user's info by user_name '''

    return await get_spec_user_by_name(user_name)


@router.get("/")
async def read_user() -> list[UpdateUser]:
    ''' The router of getting all users' info '''

    return await get_all_user()


@router.post("/create")
async def create_user(user: CreateUser) -> None:
    ''' The router of creating a user '''

    return await create_new_user(user)