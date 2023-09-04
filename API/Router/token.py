from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from jose import jwt

from Repository.TokenCRUD import generate_access_token, generate_refresh_token, validate_access_token, validate_refresh_token, generate_access_token_using_refresh_token

router = APIRouter(prefix="/token", tags=["Token"])


@router.post("/access_token")
async def create_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]) -> None:
    """The endpoint of generating new access_token"""

    data = {
        "user_name": form_data.username,
        "user_password": form_data.password
    }

    access_token = await generate_access_token(data)

    return {"access_token": access_token}


@router.post("/refresh_token")
async def create_refresh_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]) -> None:
    """The endpoint of generating new refresh_token"""

    data = {
        "user_name": form_data.username,
        "user_password": form_data.password
    }

    refresh_token = await generate_refresh_token(data)

    return {"refresh_token": refresh_token}


@router.post("/validate_access_token")
async def validate_the_access_token(token: str) -> None:
    """The endpoint of validate the access_token's availability"""

    return await validate_access_token(token)


@router.post("/validate_refresh_token")
async def validate_the_refresh_token(token: str) -> None:
    """The endpoint of validate the refresh_token's availability"""

    return await validate_refresh_token(token)


@router.post("/get_new_access_token")
async def get_new_access_token_using_refresh_token(token: str) -> None:
    """The endpoint of getting new access_token using refresh_token"""

    access_token = await generate_access_token_using_refresh_token(token)

    return {"access_token": access_token}
