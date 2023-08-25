from pydantic import BaseModel
from datetime import date


# ----- Schemas for User table -----
class BaseUser(BaseModel):
    user_name: str


class CreateUser(BaseUser):
    user_password: str
    user_birthdate: date | None


class ShowUserId(BaseModel):
    user_id: int


class UpdateUser(BaseUser):
    user_id: int
    user_birthdate: date | None


class DeleteUser(BaseUser):
    user_id: int
    user_password: str


# ----- Schemas for Repository table -----
class BaseRepository(BaseModel):
    repo_name: str


class UpdateRepository(BaseRepository):
    repo_id: int


class CreateRepository(BaseRepository):
    creator_id: int


# ----- Schemas for Task table -----
class BaseTask(BaseModel):
    task_name: str
    task_description: str
    task_due_date: date | None
    task_finish: int


class ReadTasksUsingUserId(BaseTask):
    task_id: int
    belongs_to_repository_id: int


class ReadTasksUsingRepoId(BaseTask):
    task_id: int
    creator_id: int


class CreateTask(BaseTask):
    creator_id: int
    belongs_to_repository_id: int


class UpdateTask(ReadTasksUsingUserId):
    creator_id: int


class DeleteTask(BaseModel):
    task_id: int


# ----- Schemas for Tag table -----


class BaseTag(BaseModel):
    tag_name: str


class CreateTag(BaseTag):
    creator_id: int
    belongs_to_repository_id: int


class UpdateTag(BaseTag):
    tag_id: int


class DeleteTag(BaseModel):
    tag_id: int
