from fastapi.security import OAuth2PasswordBearer

oauth2_access_token_scheme = OAuth2PasswordBearer(
    tokenUrl='/token/access_token')

oauth2_refresh_token_scheme = OAuth2PasswordBearer(
    tokenUrl='/token/refresh_token')
