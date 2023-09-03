# Scenario 1 - Create User
response=$(curl -s -X POST \
  "http://122.116.20.182:8002/user/create" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"user_name": "User1", "user_password": "User1", "user_birthdate": "2023-01-01"}'
)
echo ${response}
if [ "$response" != '{"detail":"Success:Successfully created the user."}' ]; then
  exit 1
fi

# Scenario 2 - Get User's access token
response=$(curl -s -X POST \
  "http://122.116.20.182:8002/token/access_token" \
  -H "accept: application/json" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'username=User1&password=User1'
)
echo ${response}
user_token=$(echo "$response" | grep "access_token")
user_token=$(echo "$user_token" | awk -F'"' '{print $4}')
if [ -z "$user_token" ]; then
  exit 1
fi

# Scenario 3 - Read self user id
response=$(curl -s -X GET \
  "http://122.116.20.182:8002/user/name/{name}?user_name=User1" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${user_token}"
)
echo ${response}
user_id=$(echo "$response" | grep "user_id")
user_id=$(echo "$user_id" | awk -F'"' '{print $4}')
user_id=$((user_id))
if [ -z "$user_id" ]; then
  exit 1
fi

# Scenario 4 - Read self user (Withour token)
response=$(curl -s -X GET \
  "http://122.116.20.182:8002/user/id/{id}?user_id=${user_id}" \
  -H "accept: application/json"
)
echo ${response}
if [ "$response" != '{"detail":"Not authenticated"}' ]; then
  exit 1
fi

# Scenario 5 - Read self user (With token)
response=$(curl -s -X GET \
  "http://122.116.20.182:8002/user/id/{id}?user_id=${user_id}" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${user_token}"
) 
echo ${response}
user_name=$(echo "$response" | grep "user_name")
user_name=$(echo "$user_name" | awk -F'"' '{print $4}')
user_birthdate=$(echo "$response" | grep "user_birthdate")
user_birthdate=$(echo "$user_birthdate" | awk -F'"' '{print $4}')
if [ -z "$user_name" ] || [ -z "$user_birthdate" ]; then
  exit 1
fi
