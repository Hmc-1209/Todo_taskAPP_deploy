#### API design for Repository table

>##### GET - /repository/user_id/{user_id}
>###### Read all repositories of specific user using user_id.
>body: N / A  
>
>return: [
>&emsp;{
>&emsp;&emsp; repo_name: xxx,
>&emsp;&emsp; creator_id: xxx
>&emsp;},
>&emsp;...
>]
>###### Exception handle:
>User not found -> User with corresponding id does not exist.(404)
>Reading repo with wrong user id -> Access denied, you are not allowed to read repository from other user.(403)

>##### POST - /repository/create
>###### Create new repositorie.
>body: {
>&emsp;repo_name: xxx,
>&emsp;creator_id: xxx
>}
>
>return: {"detailed":"Success:Successfully created new repository.}
>###### Exception handle:
>User not found -> User with corresponding id does not exist.(404)
>Creating repo with wrong user id -> Access denied, you are not allowed to create repository for other user.(403)

>##### PUT - /repository/update
>###### Update the repositorie name.
>body: {
>&emsp;repo_name: xxx,
>&emsp;repo_id: xxx
>}
>
>return: {"detailed":"Success:Successfully updated the repository.}
>###### Exception handle:
>Repo not found -> Repository with corresponding id does not exist.(404)
>Updating repo with wrong user id -> Access denied, you are not allowed to update repository for other user.(403)

>##### DALETE - /repository/delete
>###### Delete the repositorie.
>body: {
>&emsp;repo_name: xxx,
>&emsp;repo_id: xxx
>}
>
>return: {"detailed":"Success:Successfully deleted the repository.}
>###### Exception handle:
>Repo not found -> Repository with corresponding id does not exist.(404)
>Deleting repo with wrong user id -> Access denied, you are not allowed to delete repository for other user.(403)