from fastapi import Depends, HTTPException, status

token_expired = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN, detail="Token expired.")

user_not_found = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

password_incorrect = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND, detail="Password incorrect.")
