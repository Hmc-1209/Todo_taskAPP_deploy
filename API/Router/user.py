from fastapi import APIRouter, Depends
from typing import Annotated
from schemas import CreateUser, UpdateUser, DeleteUser, ShowUserId
from Repository.UserCRUD import *
from Authentication.JWTtoken import get_current_user


router = APIRouter(prefix="/user", tags=["User"])


@router.get("/id/{id}")
async def read_user_with__corresponding_id(user_id: int, current_user: Annotated[UpdateUser, Depends(get_current_user)]) -> UpdateUser:
    """The endpoint of getting specific user's info by user_id"""

    if user_id != current_user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Access denied. You are not allowed to read other user's info.")

    return await get_spec_user_by_id(user_id)


@router.get("/name/{name}")
async def read_user_id_with_corresponding_name(user_name: str, current_user: Annotated[UpdateUser, Depends(get_current_user)]) -> ShowUserId:
    """The endpoint of getting specific user's info by user_name"""

    if user_name != current_user.user_name:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Access denied. You are not allowed to read other user's info.")

    return await get_spec_user_id_by_name(user_name)


@router.get("/")
async def read_all_user(current_user: Annotated[UpdateUser, Depends(get_current_user)]) -> list[UpdateUser]:
    """The endpoint of getting all users' info"""

    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                        detail="Access denied. You do not have permission to read all users' info.")

    return await get_all_user()


@router.post("/create")
async def create_user(user: CreateUser) -> None:
    """The endpoint of creating a user"""

    return await create_new_user(user)


@router.put("/update_info")
async def update_user(user: UpdateUser, current_user: Annotated[UpdateUser, Depends(get_current_user)]) -> None:
    """The endpoint of updating a user's info"""

    if user.user_id != current_user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Access denied. You are not allowed to update other user's info.")

    return await update_user_info(user)


@router.delete("/delete")
async def delete_user(user: DeleteUser, current_user: Annotated[UpdateUser, Depends(get_current_user)]) -> None:
    """The endpoint of deleting a user"""

    if user.user_id != current_user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Access denied. You are not allowed to delete other user.")

    return await delete_spec_user(user)
