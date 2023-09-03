path="http://122.116.20.182:8002"

#
#   Initial actions : remove test user's tag, task, repo and user, then recreate it (They will only exist one at a time, so there is no need to delete with loop.)
#

# Get the test user's access token
response=$(curl -s -X POST \
  "${path}/token/access_token" \
  -H "accept: application/json" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'username=User1&password=User1'
)
user_token=$(echo "$response" | grep "access_token")
user_token=$(echo "$user_token" | awk -F'"' '{print $4}')
if [ -z "$user_token" ]; then
  echo ${response}
  echo "Failed to get test user(User1)'s access token."
  exit 1
fi
# Get the test user's id
response=$(curl -s -X GET \
  "${path}/user/name/{name}?user_name=User1" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${user_token}"
)
user_id=$(echo "$response" | grep "user_id" | awk -F'"' '{print $3}' | awk -F':' '{print $2}' | awk -F'}' '{print $1}')
if [ -z "$user_id" ]; then
  echo ${response}
  echo "Failed to get test user's id 'User1'."
  exit 1
fi
# Read test user's repo
response=$(curl -s -X GET \
  "${path}/repository/id/{id}?user_id=${user_id}" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${user_token}"
)
repo_name=$(echo "$response" | grep "repo_name")
repo_name=$(echo "$repo_name" | awk -F'"' '{print $4}')
repo_id=$(echo "$response" | grep "repo_id")
repo_id=$(echo "$repo_id" | awk -F'"' '{print $7}' | awk -F':' '{print $2}' | awk -F'}' '{print $1}')
if [ -z "$repo_name" ] || [ -z "$repo_id" ]; then
  echo ${response}
  echo "Failed to read test user's repo."
  exit 1
fi
# Read test user's task
response=$(curl -s -X GET \
  "${path}/task/user_id/{id}?user_id=${user_id}" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${user_token}"
)
failed_message=$(echo "$response" | grep "detail")
failed_message=$(echo "$failed_message" | awk -F'"' '{print $4}')
task_id=$(echo "$response" | grep "task_id")
task_id=$(echo "$task_id" | awk -F'"' '{print $17}' | awk -F':' '{print $2}' | awk -F',' '{print $1}')
if [ "$failed_message" ]; then
  echo ${response}
  echo "Failed to get test user's tasks."
  exit 1
fi
# Read test user's tag
response=$(curl -s -X GET \
  "${path}/tag/repo_id/{id}?repo_id=${repo_id}" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${user_token}"
)
failed_message=$(echo "$response" | grep "detail")
failed_message=$(echo "$failed_message" | awk -F'"' '{print $4}')
tag_id=$(echo "$response" | grep "tag_id")
tag_id=$(echo "$tag_id" | awk -F'"' '{print $7}' | awk -F':' '{print $2}' | awk -F'}' '{print $1}')
if [ "$failed_message" ]; then
  echo ${response}
  echo "Failed to read test user's tag."
  exit 1
fi
# Delete task if it exist
if [ "$task_id" ]; then
  response=$(curl -s -X DELETE \
    "${path}/task/delete" \
    -H "accept: application/json" \
    -H "Content-Type: application/json"  \
    -d '{"task_id": "'${task_id}'"}' \
    -H "Authorization: Bearer ${user_token}"
  )
  if [ "$response" != '{"detail":"Success:Successfully deleted the task."}' ]; then
    echo ${response}
    echo "Failed to delete test user's task."
    exit 1
  fi
fi
# Delete tag if it exist
if [ "$tag_id" ]; then
  response=$(curl -s -X DELETE \
    "${path}/tag/delete" \
    -H "accept: application/json" \
    -H "Content-Type: application/json" \
    -d '{"tag_id": "'${tag_id}'"}' \
    -H "Authorization: Bearer ${user_token}"
  )
  if [ "$response" != '{"detail":"Success:Successfully deleted the tag."}' ]; then
    echo ${response}
    echo "Failed to delete test user's tag."
    exit 1
  fi
fi
# Delete repo if it exist
if [ "$repo_id" ]; then
  response=$(curl -s -X DELETE \
    "${path}/repository/delete" \
    -H "accept: application/json" \
    -H "Content-Type: application/json"  \
    -d '{"repo_name": "TestRepo2", "repo_id": '${repo_id}'}' \
    -H "Authorization: Bearer ${user_token}"
  )
  if [ "$response" != '{"detail":"Success:Successfully deleted the repository."}' ]; then
    echo ${response}
    echo "Failed to delete test user's repo."
    exit 1
  fi
fi
# Delete test user
response=$(curl -s -X DELETE \
  "http://122.116.20.182:8002/user/delete" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"user_name": "User1", "user_id": "'"${user_id}"'", "user_password": "User1"}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Success:Successfully deleted the user."}' ]; then
  echo ${response}
  echo "Failed to delete test user 'User1'."
  exit 1
fi

# --------------------------------- Testing Scenarios ---------------------------------


# Scenario 1 - Create User
response=$(curl -s -X POST \
  "${path}/user/create" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"user_name": "User1", "user_password": "User1", "user_birthdate": "2023-01-01"}'
)
if [ "$response" != '{"detail":"Success:Successfully created the user."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 1 - Create User : Pass"


# Scenario 2 - Get User's access token
response=$(curl -s -X POST \
  "${path}/token/access_token" \
  -H "accept: application/json" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'username=User1&password=User1'
)
user_token=$(echo "$response" | grep "access_token")
user_token=$(echo "$user_token" | awk -F'"' '{print $4}')
if [ -z "$user_token" ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 2 - Get User's access token : Pass"


# Scenario 3 - Read self user id (With token)
response=$(curl -s -X GET \
  "${path}/user/name/{name}?user_name=User1" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${user_token}"
)
user_id=$(echo "$response" | grep "user_id" | awk -F'"' '{print $3}' | awk -F':' '{print $2}' | awk -F'}' '{print $1}')
if [ -z "$user_id" ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 3 - Read self user id (With token) : Pass"


# Scenario 4 - Read self user (Withour token)
response=$(curl -s -X GET \
  "${path}/user/id/{id}?user_id=${user_id}" \
  -H "accept: application/json"
)
if [ "$response" != '{"detail":"Not authenticated"}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 4 - Read self user (Withour token) : Pass"


# Scenario 5 - Read self user (With token)
response=$(curl -s -X GET \
  "${path}/user/id/{id}?user_id=${user_id}" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${user_token}"
) 
user_name=$(echo "$response" | grep "user_name")
user_name=$(echo "$user_name" | awk -F'"' '{print $4}')
user_birthdate=$(echo "$response" | grep "user_birthdate")
user_birthdate=$(echo "$user_birthdate" | awk -F'"' '{print $4}')
if [ -z "$user_name" ] || [ -z "$user_birthdate" ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 5 - Read self user (With token) : Pass"


# Scenario 6 - Read unknown user id (With token)
response=$(curl -s -X GET \
  "${path}/user/id/{id}?user_id=-1" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"User with corresponding id does not exist."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 6 - Read unknown user id (With token) : Pass"


# Scenario 7 - Read other user with id 1 (With token)
response=$(curl -s -X GET \
  "${path}/user/id/{id}?user_id=1" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Access denied. You are not allowed to read other user'\''s info."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 7 - Read other user with id 1 (With token) : Pass"


# Scenario 8 - Read self user id (Without token)
response=$(curl -s -X GET \
  "${path}/user/name/{name}?user_name=User1" \
  -H "accept: application/json"
)
if [ "$response" != '{"detail":"Not authenticated"}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 8 - Read self user id (Without token) : Pass"


# Scenario 9 - Read other user (With token)
response=$(curl -s -X GET \
  "${path}/user/name/{name}?user_name=DANNY%20HO" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Access denied. You are not allowed to read other user'\''s info."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 9 - Read other user (With token) : Pass"


# Scenario 10 - Read unknown user (With token)
response=$(curl -s -X GET \
  "${path}/user/name/{name}?user_name=name" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Access denied. You are not allowed to read other user'\''s info."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 10 - Read unknown user (With token) : Pass"


# Scenario 11 - Read all user (With token)
response=$(curl -s -X GET \
  "${path}/user/" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Access denied. You do not have permission to read all users'\'' info."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 11 - Read all user (With token) : Pass"


# Scenario 12 - Update self user info (Without token)
response=$(curl -s -X PUT \
  "${path}/user/update_info" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"user_name": "'${user_name}'", "user_id": "'${user_name}'", "user_birthdate": "2022-12-31"}'
)
if [ "$response" != '{"detail":"Not authenticated"}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 12 - Update self user info (Without token) : Pass"


# Scenario 13 - Update self user info (With token)
response=$(curl -s -X PUT \
  "${path}/user/update_info" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"user_name": "'${user_name}'", "user_id": "'${user_id}'", "user_birthdate": "2022-12-31"}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Success:Successfully updated the user'\''s info."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 13 - Update self user info (With token) : Pass"


# Scenario 14 - Update other's user info (With token)
response=$(curl -s -X PUT \
  "${path}/user/update_info" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"user_name": "DANNY%20HO", "user_id": "1", "user_birthdate": "2022-12-31"}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Access denied. You are not allowed to update other user'\''s info."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 14 - Update other's user info (With token) : Pass"


# Scenario 15 - Update unknown user info (With token)
response=$(curl -s -X PUT \
  "${path}/user/update_info" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"user_name": "name", "user_id": "-1", "user_birthdate": "2022-12-31"}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"User with corresponding id does not exist."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 15 -  Update unknown user info (With token) : Pass"


# Scenario 16 - Delete self user (Without token)
response=$(curl -s -X DELETE \
  "${path}/user/delete" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"user_name": "'"${user_name}"'", "user_id": "'"${user_id}"'", "user_password": "User1"}'
)
if [ "$response" != '{"detail":"Not authenticated"}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 16 -  Delete self user (Without token) : Pass"


# Scenario 17 - Delete self user (With token, wrong password)
response=$(curl -s -X DELETE \
  "${path}/user/delete" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"user_name": "'"${user_name}"'", "user_id": "'"${user_id}"'", "user_password": "User2"}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Password incorrect."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 17 -  Delete self user (With token, wrong password) : Pass"


# Scenario 18 - Delete self user (With token)
response=$(curl -s -X DELETE \
  "${path}/user/delete" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"user_name": "'"${user_name}"'", "user_id": "'"${user_id}"'", "user_password": "User1"}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Success:Successfully deleted the user."}' ]; then
  echo ${response}
  exit 1
fi
response=$(curl -s -X POST \
  "${path}/user/create" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"user_name": "User1", "user_password": "User1", "user_birthdate": "2023-01-01"}'
)
if [ "$response" != '{"detail":"Success:Successfully created the user."}' ]; then
  echo ${response}
  echo "Failed to recreate user."
  exit 1
fi
response=$(curl -s -X POST \
  "${path}/token/access_token" \
  -H "accept: application/json" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'username=User1&password=User1'
)
user_token=$(echo "$response" | grep "access_token")
user_token=$(echo "$user_token" | awk -F'"' '{print $4}')
if [ -z "$user_token" ]; then
  echo ${response}
  echo "Failed to re-acquire user's access token."
  exit 1
fi
response=$(curl -s -X GET \
  "${path}/user/name/{name}?user_name=User1" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${user_token}"
)
user_id=$(echo "$response" | grep "user_id" | awk -F'"' '{print $3}' | awk -F':' '{print $2}' | awk -F'}' '{print $1}')
if [ -z "$user_id" ]; then
  echo ${response}
  echo "Failed to re-acquire user's id"
  exit 1
fi
echo "Scenario 18 -  Delete self user (With token) : Pass"


# Scenario 19 - Delete other user (With token)
response=$(curl -s -X DELETE \
  "${path}/user/delete" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"user_name": "DANNY%20HO", "user_id": "1", "user_password": "User1"}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Access denied. You are not allowed to delete other user."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 19 - Delete other user (With token) : Pass"


# Scenario 20 - Delete unknown user (With token)
response=$(curl -s -X DELETE \
  "${path}/user/delete" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"user_name": "name", "user_id": "-1", "user_password": "User1"}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"User with corresponding id does not exist."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 20 - Delete unknown user (With token) : Pass"


# Scenario 21 - Create self repo (Without token)
response=$(curl -s -X POST \
  "${path}/repository/create" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"repo_name": "TestRepo", "creator_id": "'${user_id}'"}'
)
if [ "$response" != '{"detail":"Not authenticated"}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 21 - Create self repo (Without token) : Pass"


# Scenario 22 - Create self repo (With token)
response=$(curl -s -X POST \
  "${path}/repository/create" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"repo_name": "TestRepo", "creator_id": "'${user_id}'"}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Success:Successfully created new repository."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 22 - Create self repo (With token) : Pass"


# Scenario 23 - Create other's repo (With token)
response=$(curl -s -X POST \
  "${path}/repository/create" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"repo_name": "TestRepo", "creator_id": 1}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Access denied, you are not allowed to create repository for other user."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 23 - Create other's repo (With token) : Pass"


# Scenario 24 - Create unknown user's repo (With token)
response=$(curl -s -X POST \
  "${path}/repository/create" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"repo_name": "TestRepo", "creator_id": -1}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"User with corresponding id does not exist."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 24 - Create unknown user's repo (With token) : Pass"


# Scenario 25 - Read self repo (Without token)
response=$(curl -s -X GET \
  "${path}/repository/id/{id}?user_id=${user_id}" \
  -H "accept: application/json"
)
if [ "$response" != '{"detail":"Not authenticated"}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 25 - Read self repo (Without token) : Pass"


# Scenario 26 - Read self repo (With token)
response=$(curl -s -X GET \
  "${path}/repository/id/{id}?user_id=${user_id}" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${user_token}"
)
repo_name=$(echo "$response" | grep "repo_name")
repo_name=$(echo "$repo_name" | awk -F'"' '{print $4}')
repo_id=$(echo "$response" | grep "repo_id")
repo_id=$(echo "$repo_id" | awk -F'"' '{print $7}' | awk -F':' '{print $2}' | awk -F'}' '{print $1}')
if [ -z "$repo_name" ] || [ -z "$repo_id" ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 26 - Read self repo (With token) : Pass"


# Scenario 27 - Read other user's repo (With token)
response=$(curl -s -X GET \
  "${path}/repository/id/{id}?user_id=1" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Access denied. You are not allowed to read other user'\''s repositories."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 27 - Read other user's repo (With token) : Pass"


# Scenario 28 - Read unknown user's repo (With token)
response=$(curl -s -X GET \
  "${path}/repository/id/{id}?user_id=-1" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"User with corresponding id does not exist."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 28 - Read unknown user's repo (With token) : Pass"


# Scenario 29 - Update self repo (Without token)
response=$(curl -s -X PUT \
  "${path}/repository/update" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"repo_name": "TestRepo2", "repo_id": "'${repo_id}'"}'
)
if [ "$response" != '{"detail":"Not authenticated"}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 29 - Update self repo (Without token) : Pass"


# Scenario 30 - Update self repo (With token)
response=$(curl -s -X PUT \
  "${path}/repository/update" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"repo_name": "TestRepo2", "repo_id": "'"${repo_id}"'"}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Success:Successfully updated the repository."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 30 - Update self repo (With token) : Pass"


# Scenario 31 - Update other user's repo (With token)
response=$(curl -s -X PUT \
  "${path}/repository/update" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"repo_name": "Testing", "repo_id": 1}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Access denied, you are not allowed to update repository for other user."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 31 - Update other user's repo (With token) : Pass"


# Scenario 32 - Update unknown repo (With token)
response=$(curl -s -X PUT \
  "${path}/repository/update" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"repo_name": "Testing", "repo_id": -1}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Repository with corresponding id does not exist."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 32 - Update unknown repo (With token) : Pass"


# Scenario 33 -  Delete self repo (Without token)
response=$(curl -s -X DELETE \
  "${path}/repository/delete" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"repo_name": "TestRepo2", "repo_id": '${repo_id}'}'
)
if [ "$response" != '{"detail":"Not authenticated"}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 33 - Delete self repo (Without token) : Pass"


# Scenario 34 - Delete self repo (With token)
response=$(curl -s -X DELETE \
  "${path}/repository/delete" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"repo_name": "TestRepo2", "repo_id": '${repo_id}'}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Success:Successfully deleted the repository."}' ]; then
  echo ${response}
  exit 1
fi
response=$(curl -s -X POST \
  "${path}/repository/create" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"repo_name": "TestRepo", "creator_id": "'${user_id}'"}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Success:Successfully created new repository."}' ]; then
  echo ${response}
  echo "Failed to recreate repository 'TestRepo'."
  exit 1
fi
response=$(curl -s -X GET \
  "${path}/repository/id/{id}?user_id=${user_id}" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${user_token}"
)
repo_name=$(echo "$response" | grep "repo_name")
repo_name=$(echo "$repo_name" | awk -F'"' '{print $4}')
repo_id=$(echo "$response" | grep "repo_id")
repo_id=$(echo "$repo_id" | awk -F'"' '{print $7}' | awk -F':' '{print $2}' | awk -F'}' '{print $1}')
if [ -z "$repo_name" ] || [ -z "$repo_id" ]; then
  echo ${response}
  echo "Failed to re-acquire repo_name or repo_id"
  exit 1
fi
echo "Scenario 34 - Delete self repo (With token) : Pass"


# Scenario 35 - Delete other user's repo (With token)
response=$(curl -s -X DELETE \
  "${path}/repository/delete" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"repo_name": "Homework", "repo_id": 1}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Access denied, you are not allowed to create repository for other user."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 35 - Delete other user's repo (With token) : Pass"


# Scenario 36 - Delete unknown repo (With token)
response=$(curl -s -X DELETE \
  "${path}/repository/delete" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"repo_name": "", "repo_id": -1}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Repository with corresponding id does not exist."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 36 - Delete unknown repo (With token) : Pass"


# Scenario 37 - Create self task (Without token)
response=$(curl -s -X POST \
  "${path}/task/create" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"task_name": "TestTask", "task_description": "", "task_due_date": "2023-08-29", "task_finish": 0, "creator_id": "'${user_id}'", "belongs_to_repository_id": "'${repo_id}'"}' 
)
if [ "$response" != '{"detail":"Not authenticated"}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 37 - Create self task (Without token) : Pass"


# Scenario - 38 Create self task (With token)
response=$(curl -s -X POST \
  "${path}/task/create" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"task_name": "TestTask", "task_description": "", "task_due_date": "2023-08-29", "task_finish": 0, "creator_id": "'${user_id}'", "belongs_to_repository_id": "'${repo_id}'"}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Success:Successfully created new task."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 38 - Create self task (With token) : Pass"


# Scenario 39 - Create task for unknown user (With token)
response=$(curl -s -X POST \
  "${path}/task/create" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"task_name": "TestTask", "task_description": "", "task_due_date": "2023-08-29", "task_finish": 0, "creator_id": -1, "belongs_to_repository_id": "'${repo_id}'"}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"User with corresponding id does not exist."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 39 - Create task for unknown user (With token) : Pass"


# Scenario 40 - Create task for unknown repo (With token)
response=$(curl -s -X POST \
  "${path}/task/create" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"task_name": "TestTask", "task_description": "", "task_due_date": "2023-08-29", "task_finish": 0, "creator_id": "'${user_id}'", "belongs_to_repository_id": -1}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Repository with corresponding id does not exist."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 40 - Create task for unknown repo (With token) : Pass"


# Scenario 41 - Create task for others with repo id (With token)
response=$(curl -s -X POST \
  "${path}/task/create" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"task_name": "TestTask", "task_description": "", "task_due_date": "2023-08-29", "task_finish": 0, "creator_id": "'${user_id}'", "belongs_to_repository_id": 1}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Access denied. You are not allowed to create task for others."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 41 - Create task for others with repo id (With token) : Pass"


# Scenario 42 - Create task for others with user id (With token)
response=$(curl -s -X POST \
  "${path}/task/create" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"task_name": "TestTask", "task_description": "", "task_due_date": "2023-08-29", "task_finish": 0, "creator_id": 1, "belongs_to_repository_id": "'${repo_id}'"}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Access denied. You are not allowed to create task for others."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 42 - Create task for others with user id (With token) : Pass"


# Scenario 43 - Read self tasks (Without token)
response=$(curl -s -X GET \
  "${path}/task/user_id/{id}?user_id=${user_id}" \
  -H "accept: application/json"
)
if [ "$response" != '{"detail":"Not authenticated"}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 43 - Read self tasks (Without token) : Pass"


# Scenario 44 - Read self tasks (With token)
response=$(curl -s -X GET \
  "${path}/task/user_id/{id}?user_id=${user_id}" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${user_token}"
)
failed_message=$(echo "$response" | grep "detail")
failed_message=$(echo "$failed_message" | awk -F'"' '{print $4}')
task_id=$(echo "$response" | grep "task_id")
task_id=$(echo "$task_id" | awk -F'"' '{print $17}' | awk -F':' '{print $2}' | awk -F',' '{print $1}')
if [ "$failed_message" ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 44 - Read self tasks (With token) : Pass"


# Scenario 45 - Read other user's tasks (With token)
response=$(curl -s -X GET \
  "${path}/task/user_id/{id}?user_id=1" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Access denied. You are not allowed to read other user'\''s tasks."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 45 - Read other user's tasks (With token) : Pass"


# Scenario 46 - Read unknown user's tasks (With token)
response=$(curl -s -X GET \
  "${path}/task/user_id/{id}?user_id=-1" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"User with corresponding id does not exist."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 46 - Read unknown user's tasks (With token) : Pass"


# Scenario 47 - Read self repo's tasks (Without token)
response=$(curl -s -X GET \
  "${path}/task/repo_id/{id}?repo_id=${user_id}" \
  -H "accept: application/json"
)
if [ "$response" != '{"detail":"Not authenticated"}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 47 - Read self repo's tasks (Without token) : Pass"


# Scenario 48 - Read self repo's tasks (With token)
response=$(curl -s -X GET \
  "${path}/task/repo_id/{id}?repo_id=${repo_id}" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${user_token}"
)
failed_message=$(echo "$response" | grep "detail")
failed_message=$(echo "$failed_message" | awk -F'"' '{print $4}')
if [ "$failed_message" ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 48 - Read self repo's tasks (With token) : Pass"


# Scenario 49 - Read other user's repo's tasks (With token)
response=$(curl -s -X GET \
  "${path}/task/repo_id/{id}?repo_id=1" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Access denied. You are not allowed to read other user'\''s tasks."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 49 - Read other user's repo's tasks (With token) : Pass"


# Scenario 50 - Read unknown repo's tasks (With token)
response=$(curl -s -X GET \
  "${path}/task/repo_id/{id}?repo_id=-1" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Repository with corresponding id does not exist."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 50 - Read unknown repo's tasks (With token) : Pass"


# Scenario 51 - Update self task (Without token)
response=$(curl -s -X PUT \
  "${path}/task/update" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"task_name": "TestTask", "task_description": "", "task_due_date": "2023-08-29", "task_finish": 1, "task_id": "'${task_id}'", "creator_id": "'${user_id}'", "belongs_to_repository_id": "'${repo_id}'"}'
)
if [ "$response" != '{"detail":"Not authenticated"}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 51 - Update self task (Without token) : Pass"


# Scenario 52 - Update self task (With token)
response=$(curl -s -X PUT \
  "${path}/task/update" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"task_name": "TestTask", "task_description": "", "task_due_date": "2023-08-29", "task_finish": 1, "task_id": "'${task_id}'", "creator_id": "'${user_id}'", "belongs_to_repository_id": "'${repo_id}'"}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Success:Successfully updated selected task."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 52 - Update self task (With token) : Pass"


# Scenario 53 - Update other's task by task id (With token)
response=$(curl -s -X PUT \
  "${path}/task/update" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"task_name": "TestTask", "task_description": "", "task_due_date": "2023-08-29", "task_finish": 1, "task_id": 1, "creator_id": "'${user_id}'", "belongs_to_repository_id": "'${repo_id}'"}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Access denied. You are not allowed to update task for others."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 53 - Update other's task by task id (With token) : Pass"


# Scenario 54 - Update unknown task (With token)
response=$(curl -s -X PUT \
  "${path}/task/update" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"task_name": "TestTask", "task_description": "", "task_due_date": "2023-08-29", "task_finish": 1, "task_id": -1, "creator_id": "'${user_id}'", "belongs_to_repository_id": "'${repo_id}'"}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Task with corresponding id does not exist."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 54 - Update unknown task (With token) : Pass"


# Scenario 55 - Delete self task (Without token)
response=$(curl -s -X DELETE \
  "${path}/task/delete" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"task_id": "'${task_id}'"}'
)
if [ "$response" != '{"detail":"Not authenticated"}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 55 - Delete self task (Without token) : Pass"


# Scenario 56 - Delete self task (With token)
response=$(curl -s -X DELETE \
  "${path}/task/delete" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"task_id": "'${task_id}'"}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Success:Successfully deleted the task."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 56 - Delete self task (With token) : Pass"


# Scenario 57 - Delete other user's task (With token)
response=$(curl -s -X DELETE \
  "${path}/task/delete" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"task_id": 1}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Access denied. You are not allowed to delete other user'\''s tasks."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 57 - Delete other user's task (With token) : Pass"


# Scenario 58 - Delete unknown task (With token)
response=$(curl -s -X DELETE \
  "${path}/task/delete" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"task_id": -1}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Task with corresponding id does not exist."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 58 - Delete unknown task (With token) : Pass"


# Scenario 59 - Create self tag (Without token)
response=$(curl -s -X POST \
  "${path}/tag/create" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"tag_name": "TestTag", "creator_id": "'${user_id}'", "belongs_to_repository_id": "'${repo_id}'"}'
)
if [ "$response" != '{"detail":"Not authenticated"}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 59 - Create self tag (Without token) : Pass"


# Scenario 60 - Create self tag (With token)
response=$(curl -s -X POST \
  "${path}/tag/create" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"tag_name": "TestTag", "creator_id": "'${user_id}'", "belongs_to_repository_id": "'${repo_id}'"}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Success:Successfully created tag"}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 60 - Create self tag (With token) : Pass"


# Scenario 61 - Create tag for other user using user id (With token)
response=$(curl -s -X POST \
  "${path}/tag/create" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"tag_name": "TestTag", "creator_id": 1, "belongs_to_repository_id": "'${repo_id}'"}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Access denied. You are not allowed to create tag for other user."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 61 - Create tag for other user using user id (With token) : Pass"


# Scenario 62 - Create tag for unknown user using user id (With token)
response=$(curl -s -X POST \
  "${path}/tag/create" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"tag_name": "TestTag", "creator_id": -1, "belongs_to_repository_id": "'${repo_id}'"}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"User with corresponding id does not exist."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 62 - Create tag for unknown user using user id (With token) : Pass"


# Scenario 63 - Create tag for other user using repo id (With token)
response=$(curl -s -X POST \
  "${path}/tag/create" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"tag_name": "TestTag", "creator_id": "'${user_id}'", "belongs_to_repository_id": 1}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Access denied. You are not allowed to create tag for other user."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 63 - Create tag for other user using repo id (With token) : Pass"


# Scenario 64 - Create tag for unknown user using repo id (With token)
response=$(curl -s -X POST \
  "${path}/tag/create" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"tag_name": "TestTag", "creator_id": "'${user_id}'", "belongs_to_repository_id": -1}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Repository with corresponding id does not exist."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 64 - Create tag for unknown user using repo id (With token) : Pass"


# Scenario 65 - Read tags from self repo (Without token)
response=$(curl -s -X GET \
  "${path}/tag/repo_id/{id}?repo_id=${repo_id}" \
  -H "accept: application/json"
)
if [ "$response" != '{"detail":"Not authenticated"}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 65 - Read tags from self repo (Without token) : Pass"


# Scenario 66 - Read tags from self repo (With token)
response=$(curl -s -X GET \
  "${path}/tag/repo_id/{id}?repo_id=${repo_id}" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${user_token}"
)
failed_message=$(echo "$response" | grep "detail")
failed_message=$(echo "$failed_message" | awk -F'"' '{print $4}')
tag_id=$(echo "$response" | grep "tag_id")
tag_id=$(echo "$tag_id" | awk -F'"' '{print $7}' | awk -F':' '{print $2}' | awk -F'}' '{print $1}')
if [ "$failed_message" ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 66 - Read tags from self repo (With token) : Pass"


# Scenario 67 - Read tags from other user's repo (With token)
response=$(curl -s -X GET \
  "${path}/tag/repo_id/{id}?repo_id=1" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Access denied. You are not allowed to read other user'\''s tags."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 67 - Read tags from other user's repo (With token) : Pass"


# Scenario 68 - Read tags from unknown repo (With token)
response=$(curl -s -X GET \
  "${path}/tag/repo_id/{id}?repo_id=-1" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Repository with corresponding id does not exist."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 68 - Read tags from unknown repo (With token) : Pass"


# Scenario 69 - Update self tag (Without token)
response=$(curl -s -X PUT \
  "${path}/tag/update" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"tag_name": "TestTag2", "tag_id": "'${tag_id}'"}'
)
if [ "$response" != '{"detail":"Not authenticated"}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 69 - Update self tag (Without token) : Pass"


# Scenario 70 - Update self tag (With token)
response=$(curl -s -X PUT \
  "${path}/tag/update" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"tag_name": "TestTag2", "tag_id": "'${tag_id}'"}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Success:Successfully updated the tag."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 70 - Update self tag (With token) : Pass"


# Scenario 71 - Update other user's tag (With token)
response=$(curl -s -X PUT \
  "${path}/tag/update" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"tag_name": "TestTag2", "tag_id": 1}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Access denied. You are not allowed to update other user'\''s tag."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 71 - Update other user's tag (With token) : Pass"


# Scenario 72 - Update unknown tag (With token)
response=$(curl -s -X PUT \
  "${path}/tag/update" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"tag_name": "TestTag2", "tag_id": -1}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Tag with corresponding id does not exist."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 72 - Update unknown tag (With token) : Pass"


# Scenario 73 - Delete self tag (Without token)
response=$(curl -s -X DELETE \
  "${path}/tag/delete" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"tag_id": "'${tag_id}'"}'
)
if [ "$response" != '{"detail":"Not authenticated"}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 73 - Delete self tag (Without token) : Pass"


# Scenario 74 - Delete self tag (With token)
response=$(curl -s -X DELETE \
  "${path}/tag/delete" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"tag_id": "'${tag_id}'"}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Success:Successfully deleted the tag."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 74 - Delete self tag (With token) : Pass"


# Scenario 75 - Delete other user's tag (With token)
response=$(curl -s -X DELETE \
  "${path}/tag/delete" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"tag_id": 1}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Access denied. You are not allowed to delete other user'\''s tag."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 75 - Delete other user's tag (With token) : Pass"


# Scenario 76 - Delete unknown tag (With token)
response=$(curl -s -X DELETE \
  "${path}/tag/delete" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"tag_id": -1}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"Tag with corresponding id does not exist."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 76 - Delete unknown tag (With token) : Pass"


# Scenario 77 - Get refresh token
response=$(curl -s -X POST \
  "${path}/token/refresh_token" \
  -H "accept: application/json" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'username=User1&password=User1'
)
refresh_token=$(echo "$response" | grep "refresh_token")
refresh_token=$(echo "$refresh_token" | awk -F'"' '{print $4}')
if [ -z "$refresh_token" ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 77 - Get refresh token : Pass"


# Scenario 78 - Validate access token
response=$(curl -s -X POST \
  "${path}/token/validate_access_token?token=${user_token}" \
  -H "accept: application/json" \
  -H "Content-Type: application/x-www-form-urlencoded"
)
if [ "$response" != '{"detail":"Token avaliable."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 78 - Validate access token : Pass"


# Scenario 79 - Validate refresh token
response=$(curl -s -X POST \
  "${path}/token/validate_refresh_token?token=${refresh_token}" \
  -H "accept: application/json" \
  -H "Content-Type: application/x-www-form-urlencoded"
)
if [ "$response" != '{"detail":"Token avaliable."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 79 - Validate refresh token : Pass"

echo "All scenarios passes successfully!"