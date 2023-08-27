from passlib.context import CryptContext

pwd_obj = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hashing_password(pwd):
    """Hashing the password"""

    return pwd_obj.hash(pwd)


def verify_password(req_pwd, pwd):
    """Verify from plain password to hashed password"""

    return pwd_obj.verify(req_pwd, pwd)
