# Scenario 1 - Create User
# response=$(curl -s -X POST \
#   "http://122.116.20.182:8002/user/create" \
#   -H "accept: application/json" \
#   -H "Content-Type: application/json" \
#   -d '{"user_name": "User1", "user_password": "User1", "user_birthdate": "2023-01-01"}'
# )
# if [ "$response" != '{"detail":"Success:Successfully created the user."}' ]; then
#   echo ${response}
#   exit 1
# fi
# echo "Scenario 1 - Create User : Pass"


# Scenario 2 - Get User's access token
response=$(curl -s -X POST \
  "http://122.116.20.182:8002/token/access_token" \
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
  "http://122.116.20.182:8002/user/name/{name}?user_name=User1" \
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
  "http://122.116.20.182:8002/user/id/{id}?user_id=${user_id}" \
  -H "accept: application/json"
)
if [ "$response" != '{"detail":"Not authenticated"}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 4 - Read self user (Withour token) : Pass"


# Scenario 5 - Read self user (With token)
response=$(curl -s -X GET \
  "http://122.116.20.182:8002/user/id/{id}?user_id=${user_id}" \
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
  "http://122.116.20.182:8002/user/id/{id}?user_id=-1" \
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
  "http://122.116.20.182:8002/user/id/{id}?user_id=1" \
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
  "http://122.116.20.182:8002/user/name/{name}?user_name=User1" \
  -H "accept: application/json"
)
if [ "$response" != '{"detail":"Not authenticated"}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 8 - Read self user id (Without token) : Pass"


# Scenario 9 - Read other user (With token)
response=$(curl -s -X GET \
  "http://122.116.20.182:8002/user/name/{name}?user_name=DANNY%20HO" \
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
  "http://122.116.20.182:8002/user/name/{name}?user_name=name" \
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
  "http://122.116.20.182:8002/user/" \
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
  "http://122.116.20.182:8002/user/update_info" \
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
  "http://122.116.20.182:8002/user/update_info" \
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
  "http://122.116.20.182:8002/user/update_info" \
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


# Scenario - 15 Update unknown user info (With token)
response=$(curl -s -X PUT \
  "http://122.116.20.182:8002/user/update_info" \
  -H "accept: application/json" \
  -H "Content-Type: application/json"  \
  -d '{"user_name": "name", "user_id": "-1", "user_birthdate": "2022-12-31"}' \
  -H "Authorization: Bearer ${user_token}"
)
if [ "$response" != '{"detail":"User with corresponding id does not exist."}' ]; then
  echo ${response}
  exit 1
fi
echo "Scenario 15 Update unknown user info (With token) : Pass"