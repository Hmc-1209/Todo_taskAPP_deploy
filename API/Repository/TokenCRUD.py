from fastapi import HTTPException, status
from database import db
from jose import jwt

from models import User
from Repository.CommonCRUD import check_user
from Authentication import JWTtoken
from Authentication.config import ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY, ALGORITHM
from Authentication.hashing import verify_password
from Exceptions import *


async def generate_access_token(data: dict):
    """Generate the access_token"""

    stmt = User.select().where(User.c.user_name == data["user_name"])
    user = await db.fetch_one(stmt)

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="User with corresponding name does not exist.")

    if verify_password(data["user_password"], user.user_password):
        data["id"] = user.user_id

        return JWTtoken.generate_access_token(data)

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                        detail="Password incorrect.")


async def generate_refresh_token(data: dict):
    """Generate the refresh_token"""

    stmt = User.select().where(User.c.user_name == data["user_name"])
    user = await db.fetch_one(stmt)

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="User with corresponding name does not exist.")

    if verify_password(data["user_password"], user.user_password):
        data["id"] = user.user_id

        return JWTtoken.generate_refresh_token(data)

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                        detail="Password incorrect.")


async def validate_access_token(token: str):
    """Validate the avalibility of given access_token"""

    try:
        payload = jwt.decode(
            token, ACCESS_TOKEN_SECRET_KEY, algorithms=ALGORITHM)

        user = await check_user(payload["id"])

        if not user:
            raise user_not_found

        if not verify_password(payload["user_password"], user.user_password):
            raise password_incorrect

        return {"detail": "Token avaliable."}

    except:
        raise token_expired


async def validate_refresh_token(token: str):
    """Validate the avalibility of given refresh_token"""

    try:
        payload = jwt.decode(
            token, REFRESH_TOKEN_SECRET_KEY, algorithms=ALGORITHM)

        user = await check_user(payload["id"])

        if not user:
            raise user_not_found

        if not verify_password(payload["user_password"], user.user_password):
            raise password_incorrect

        return {"detail": "Token avaliable."}

    except:
        raise token_expired
