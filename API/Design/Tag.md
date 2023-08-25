#### API designs for Tag table
   
>##### GET - /tag/repo_id/{repo_id}
>###### Read all tags by repo id.
>body: N / A  
>
>return: [
>&emsp;{
>&emsp;&emsp; tag_id: xxx,
>&emsp;&emsp; tag_name: xxx
>&emsp;},
>&emsp;...
>]
>###### Exception handle:
>Repo id not found -> Repo with corresponding id does not exist.(404)
>Repo's creator not match -> Access denied. You are not allowed to read other user's tags.


>##### POST - /tag/create
>###### Create new tag.
>body: {
>&emsp; tag_name: xxx,
>&emsp; creator_id: xxx,
>&emsp; belongs_to_repository_id: xxx,
>}
>
>return: {"detail": "Success:Successfully created new tag."}
>
>###### Exception handle:
>Creator id not found -> User with corresponding id does not exist.(404)
>Repo id not found -> Repository with corresponding id does not exist.(404)
>Tag's creator not match -> Access denied. You are not allowed to create tag for others.

>##### PUT - /tag/update
>###### Update tag.
>body: {
>&emsp; tag_id: xxx,
>&emsp; tag_name: xxx,
>}
>
>return: {"detail": "Success:Successfully updated the tag."}
>
>###### Exception handle:
>Tag id not found -> Tag with corresponding id does not exist.(404)
>Tag's creator not match -> Access denied. You are not allowed to update other user's tags.

>##### DELETE - /tag/delete
>###### Delete tag.
>body: {
>&emsp; tag_id: xxx
>}
>
>return: {"detail": "Success:Successfully deleted the tag."}
>
>###### Exception handle:
>Tag id not found -> Tag with corresponding id does not exist.(404)
>Tag's creator not match -> Access denied. You are not allowed to delete other user's tags.