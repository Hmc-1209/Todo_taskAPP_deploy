from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from datetime import timedelta, datetime
from jose import jwt

from Repository.CommonCRUD import check_user
from Authentication.hashing import verify_password
from Authentication.OAuth2 import oauth2_access_token_scheme
from Authentication.config import ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY, ALGORITHM
from Exceptions import *

ACCESS_TOKEN_EXPIRE_DAYS = 7
REFRESH_TOKEN_EXPIRE_DAYS = 30


def generate_access_token(data: dict):
    """Generate access_token"""

    data["exp"] = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    token = jwt.encode(data, ACCESS_TOKEN_SECRET_KEY, algorithm=ALGORITHM)

    return token


def generate_refresh_token(data: dict):
    """Generate refresh_token"""

    data["exp"] = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    token = jwt.encode(data, REFRESH_TOKEN_SECRET_KEY, algorithm=ALGORITHM)

    print(jwt.decode(token, REFRESH_TOKEN_SECRET_KEY, algorithms=ALGORITHM))

    return token


async def get_current_user(token=Depends(oauth2_access_token_scheme)):
    """Get the current user's info, also used for authenticate JWT"""

    try:
        payload = jwt.decode(
            token, ACCESS_TOKEN_SECRET_KEY, algorithms=ALGORITHM)

        user = await check_user(payload["id"])

        if not user:
            raise user_not_found

        if not verify_password(payload["user_password"], user.user_password):
            raise password_incorrect

        return user

    except:
        raise token_expired
