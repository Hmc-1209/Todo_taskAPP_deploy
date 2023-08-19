from pydantic import BaseModel
from datetime import date

# ----- Schemas for User table -----
class BaseUser(BaseModel):
  user_name: str
  user_birthdate: date | None

class CreateUser(BaseUser):
  user_password: str

class UpdateUser(CreateUser):
  user_id: int


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

class CreateTask(BaseTask):
  creator_id: int
  belongs_to_repository_id: int

class UpdateTask(CreateTask):
  task_finish: int