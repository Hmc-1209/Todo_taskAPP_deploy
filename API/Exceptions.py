from fastapi import Depends, HTTPException, status

token_expired = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN, detail="Token expired.")

user_not_found = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

password_incorrect = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND, detail="Password incorrect.")


def not_found(name):
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=name + " with corresponding id does not exist."
    )


def access_denied_not_allowed(action: str, type: str):
    return HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied. You are not allowed to " + action + " other user's " + type + ".")
