from fastapi import HTTPException, status

token_expired = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN, detail="Token expired or cannot recognize.")

user_not_found = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

password_incorrect = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND, detail="Password incorrect.")


def not_found(name):
    """Raise the exception of unknown id"""

    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=name + " with corresponding id does not exist."
    )


def access_denied_not_allowed(action: str, type: str):
    """Raise the exception of denying action or access."""

    return HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied. You are not allowed to " + action + " other user's " + type + ".")
