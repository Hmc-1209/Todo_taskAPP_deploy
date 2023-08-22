import sqlalchemy
from sqlalchemy import Column, ForeignKey, INTEGER, VARCHAR, DATE, MetaData, Table

metadata_obj = MetaData()

User = Table(
    "User",
    metadata_obj,
    Column("user_id", INTEGER, primary_key=True, index=True),
    Column("user_name", VARCHAR(50), nullable=False),
    Column("user_password", VARCHAR(64), nullable=False),
    Column("user_birthdate", DATE, nullable=False)
)