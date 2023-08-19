from fastapi import APIRouter
from schemas import BaseUser, CreateUser, UpdateUser

router = APIRouter(
    prefix="/user",
    tags=["User"]
)

@router.post("/")
async def read_user(user: BaseUser) -> BaseUser:
    return {"user_name":"Danny","user_birthdate":"2004-12-09"}