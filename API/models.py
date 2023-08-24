import sqlalchemy
from sqlalchemy import Column, ForeignKey, INTEGER, VARCHAR, DATE, MetaData, Table

metadata_obj = MetaData()

User = Table(
    "User",
    metadata_obj,
    Column("user_id", INTEGER, primary_key=True, index=True),
    Column("user_name", VARCHAR(50), nullable=False),
    Column("user_password", VARCHAR(64), nullable=False),
    Column("user_birthdate", DATE, nullable=False),
)


Repository = Table(
    "Repository",
    metadata_obj,
    Column("repo_id", INTEGER, primary_key=True, index=True),
    Column("repo_name", VARCHAR(25), nullable=False),
    Column("creator_id", INTEGER, nullable=False),
)


Task = Table(
    "Task",
    metadata_obj,
    Column("task_id", INTEGER, primary_key=True, index=True),
    Column("task_name", VARCHAR(25), nullable=False),
    Column("task_description", VARCHAR(255), nullable=True),
    Column("task_due_date", DATE, nullable=False),
    Column("task_finish", INTEGER, nullable=False),
    Column("creator_id", INTEGER, nullable=False),
    Column("belongs_to_repository_id", INTEGER, nullable=False),
)

Tag = Table(
    "Tag",
    metadata_obj,
    Column("tag_id", INTEGER, primary_key=True, index=True),
    Column("tag_name", VARCHAR(10), nullable=False),
    Column("creator_id", INTEGER, nullable=False),
    Column("belongs_to_repository_id", INTEGER, nullable=False),
)
