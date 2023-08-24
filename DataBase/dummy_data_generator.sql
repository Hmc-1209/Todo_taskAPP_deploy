USE Todo_taskAPP;

-- Insert dummy data for User table
-- Password are user_name's hashing result
INSERT INTO User (user_name, user_password, user_birthdate) VALUES
  ("DANNY HO", "2fb3d17cb13ad71c3ef5ed44a18f6637bcf669c078086a7ff8e27d827a810228", "2004-12-09"),
  ("JONAH FINLEY", "23320ffc424f8e8c037e00970093b39b1cb2e81d264ed80493008d4b866eed29", "1990-05-23"),
  ("BRYANT ORTIZ", "87ee37896565a463ae3a510abdcadd04cb468586f7c86995fca8da30dc7aef3b", "2019-04-12"),
  ("GRACELYN MORALES", "e4476efb4876d2cb13d05974a1735f2abcad23726601e9887eabe0e5d2d313cb", "2000-10-31"),
  ("ISABELLA GAMBLE", "29c3d23c89c5fcc5178447a0468fdb054fb133e913c744ac344e0c89e725c842", "2001-01-12");

-- Insert dummy data for Repository table
INSERT INTO Repository (repo_name, creator_id) VALUES
  ("Homework", 1),
  ("Housework", 1),
  ("Homework", 2),
  ("Laboratory works", 2),
  ("Research works", 2),
  ("Todo_taskAPP Project", 1),
  ("Homework", 3),
  ("Housework", 4),
  ("Buying list", 4),
  ("Teaching materials", 5);

-- Insert dummy data for Task table
INSERT INTO Task (task_name, task_description, task_due_date task_finish, creator_id, belongs_to_repository_id) VALUES
  ("Calculus assignment #1", "Finish it before 1/1.", "2023-12-12", 1, 1, 1),
  ("MoM assignment #3", "Finish it asap.", "2023-12-20", 0, 1, 1),
  ("Do the dishes", "Date 2023/8/13", "2023-8-13", 1, 1, 1),
  ("Do the dishes", "Date 2023/8/15", "2023-8-15", 1, 1, 1),
  ("Physics ch.10", "Prepare materials", "2024-12-12", 0, 5, 10),
  ("Do the dishes", "Date 2023/8/23", "2023-8-23", 0, 4, 8);
  
INSERT INTO Tag (tag_name, creator_id, belongs_to_repository_id) VALUES
  ("Urgent", 1, 1),
  ("Important", 2, 5),
  ("Urgent", 2, 4);