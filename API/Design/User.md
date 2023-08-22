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

