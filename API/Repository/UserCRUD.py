from fastapi import HTTPException, status
from database import db

from models import User
from schemas import CreateUser, UpdateUser, DeleteUser
from Repository.CommonCRUD import *
from Authentication import hashing


async def get_spec_user_id_by_name(user_name: int):
    """Get the specific user's info by name"""

    stmt = User.select().where(User.c.user_name == user_name)
    user = await db.fetch_one(stmt)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User with corresponding name does not exist.",
        )

    return user


async def get_all_user():
    """Get all users' info"""

    stmt = User.select()
    user = await db.fetch_all(stmt)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No user found in database."
        )

    return user


async def check_user_existence(user_name: str):
    """Check if the user with username already exist"""

    stmt = User.select().where(User.c.user_name == user_name)
    return await db.fetch_one(stmt)


async def create_new_user(user: CreateUser):
    """Check the usename and create the user"""

    if await check_user_existence(user.user_name):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The username has been registed.",
        )

    stmt = User.insert().values(
        user_name=user.user_name,
        user_birthdate=user.user_birthdate,
        user_password=hashing.hashing_password(user.user_password),
    )

    # Check effected row
    result = await db.execute(stmt)
    if result == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot create user.",
        )

    return {"detail": "Success:Successfully created the user."}


async def update_user_info(user: UpdateUser, origin_user_name: str):
    """Chenge the info of corresponding user id"""

    # Check the user's new name already exist or not
    if user.user_name != origin_user_name and await check_user_existence(
        user.user_name
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The username has been used.",
        )

    stmt = (
        User.update()
        .values(user_name=user.user_name, user_birthdate=user.user_birthdate)
        .where(User.c.user_id == user.user_id)
    )

    try:
        await db.execute(stmt)

    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot update user's info.",
        )

    return {"detail": "Success:Successfully updated the user's info."}


async def delete_spec_user(user: DeleteUser, user_info):
    """Delete the user with corresponding user id"""

    if user_info.user_name != user.user_name:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User with corresponding name does not exist.",
        )

    # Check the password of user
    if not hashing.verify_password(user.user_password, user_info.user_password):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Password incorrect.",
        )

    stmt = User.delete().where(User.c.user_id == user.user_id)

    # Check effected row
    result = await db.execute(stmt)
    if result == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete user.",
        )

    return {"detail": "Success:Successfully deleted the user."}
