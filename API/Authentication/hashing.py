from passlib.context import CryptContext

pwd_obj = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Hashing the password
def hashing_password(pwd):
    return pwd_obj.hash(pwd)


def verify_password(req_pwd, pwd):
    return pwd_obj.verify(req_pwd, pwd)
