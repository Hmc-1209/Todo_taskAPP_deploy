#### API designs for User table
   
>##### GET - /user/id/{id}
>###### Read the specific user info by id.
>body: N / A  
>
>return: {
>&emsp; user_id: xxx,
>&emsp; user_name: xxx,
>&emsp; user_birthdate: xxxx-xx-xx
>}
>###### Exception handle:
>User not found -> User with corresponding id does not exist.(404)
>User id doesn't belongs to user -> Access denied. You are not allowed to read other user's info.

>##### GET - /user/name/{name}
>###### Read the specific user info by name.
>body: N / A
>
>return: {
>&emsp; user_id: xxx,
>&emsp; user_name: xxx,
>&emsp; user_birthdate: xxxx-xx-xx
>}
>###### Exception handle:
>User not found -> User with corresponding name does not exist.(404)
>User id doesn't belongs to user -> Access denied. You are not allowed to read other user's info.

>##### GET - /user/
>###### Read all users' info.
>body: N / A
>
>return: [
>&emsp;{ 
>&emsp;&emsp; user_id: xxx,
>&emsp;&emsp; user_name: xxx,
>&emsp;&emsp; user_birthdate: xxxx-xx-xx
>&emsp;},
>&emsp;...
>]
>###### Exception handle:
>No user -> No user found in database.(404)
> -> Access denied. You do not have permission to read all users' info.

>##### POST - /user/create/
>###### Create new user.
>body: {
>&emsp; user_name: xxx,
>&emsp; user_birthdate: xxxx-xx-xx
>}
>
>return: {"detail":"Success:Successfully create user."}
>###### Exception handle:
>Repeated name -> The username has been registed.(403)

>##### PUT - /user/update_info/
>###### Update the user's info.
>body: {
>&emsp; user_id: xx,
>&emsp; user_name: xxx,
>&emsp; user_birthdate: xxxx-xx-xx
>}
>
>return: {"detail":"Success:Successfully updated the user's info."}
>###### Exception handle:
>Repeated name -> The username has been used.(403)
>User id doesn't belongs to user -> Access denied. You are not allowed to update other user's info.

>##### DELETE - /user/delete/
>###### Delete the user.
>body: {
>&emsp; user_id: xx,
>&emsp; user_name: xxx,
>&emsp; user_password: xxxx
>}
>
>return: {"detail":"Success:Successfully deleted the user."}
>###### Exception handle:
>Unknown user id -> User with corresponding id does not exist.(404)
>Wrong password -> Password incorrect.(403)
>User id doesn't belongs to user -> Access denied. You are not allowed to delete other user.