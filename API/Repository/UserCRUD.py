from models import User
from database import db
from fastapi import HTTPException, status
from schemas import CreateUser

async def get_spec_user_by_id(user_id: int):
    ''' Get the specific user's info by id '''

    stmt = User.select().where(User.c.user_id == user_id)
    user = await db.fetch_one(stmt)

    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User with corresponding id does not exist.")

    return user


async def get_spec_user_by_name(user_name: int):
    ''' Get the specific user's info by name '''

    stmt = User.select().where(User.c.user_name == user_name)
    user = await db.fetch_one(stmt)

    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User with corresponding name does not exist.")

    return user


async def get_all_user():
    ''' Get all users' info '''

    stmt = User.select()
    user = await db.fetch_all(stmt)

    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No user found in database.")

    return user


async def check_user_existence(user_name: str):
    ''' Check if the user with username already exist '''

    stmt = User.select().where(User.c.user_name == user_name)
    return await db.fetch_one(stmt)

async def create_new_user(user: CreateUser):
    ''' Check the usename and create the user '''

    if await check_user_existence(user.user_name):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="The username has been registed.")
    
    stmt = User.insert().values(
                                user_name=user.user_name,
                                user_birthdate=user.user_birthdate,
                                user_password=user.user_password
                            )
    await db.execute(stmt)

    return {"detail": "Success:Successfully create user."}
