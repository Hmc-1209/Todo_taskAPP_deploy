from passlib.context import CryptContext

pwd_obj = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Hashing the password
def hashing_password(pwd):
    return pwd_obj.hash(pwd)


def verify_password(req_pew, pwd):
    return pwd_obj.verify(req_pew, pwd)
