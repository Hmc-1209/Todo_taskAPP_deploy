#### API designs for Task table
   
>##### GET - /task/user_id/{id}
>###### Read all tasks by user id.
>body: N / A  
>
>return: [
>&emsp;{
>&emsp;&emsp; task_name: xxx,
>&emsp;&emsp; task_descrtiption: xxxx-xx-xx,
>&emsp;&emsp; task_due_date: xxxx-xx-xx,
>&emsp;&emsp; task_finish: x,
>&emsp;&emsp; belongs_to_repository_id: xxx,
>&emsp;},
>&emsp;...
>]
>###### Exception handle:
>User not found -> User with corresponding id does not exist.(404)
>Creator not match -> Access denied. You are not allowed to read other user's tasks.(403)

>##### GET - /task/repo_id/{id}
>###### Read all tasks by repo id.
>body: N / A  
>
>return: [
>&emsp;{
>&emsp;&emsp; task_name: xxx,
>&emsp;&emsp; task_descrtiption: xxxx-xx-xx,
>&emsp;&emsp; task_due_date: xxxx-xx-xx,
>&emsp;&emsp; task_finish: x,
>&emsp;&emsp; creator_id: xxx,
>&emsp;},
>&emsp;...
>]
>###### Exception handle:
>Repo id not found -> Repo with corresponding id does not exist.(404)
>Repo's creator not match -> Access denied. You are not allowed to read other user's tasks.(403)


>##### POST - /task/create
>###### Create new task.
>body: {
>&emsp; task_name: xxx,
>&emsp; task_description: xxx,
>&emsp; creator_id: xxx,
>&emsp; belongs_to_repository_id: xxx,
>}
>
>return: {"detail": "Success:Successfully created new task."}
>
>###### Exception handle:
>Creator id not found -> User with corresponding id does not exist.(404)
>Repo id not found -> Repository with corresponding id does not exist.(404)
>Repo's creator not match -> Access denied. You are not allowed to create task for others.(403)

>##### PUT - /task/update
>###### Update task.
>body: {
>&emsp; task_id: xxx,
>&emsp; task_name: xxx,
>&emsp; task_description: xxx,
>&emsp; task_due_date: xxx,
>&emsp; task_finish: xxx,
>&emsp; creator_id: xxx,
>}
>
>return: {"detail": "Success:Successfully updated the task."}
>
>###### Exception handle:
>Task id not found -> Task with corresponding id does not exist.(404)
>Task's creator not match -> Access denied. You are not allowed to update other user's tasks.(403)
>Task's repo not match -> Action failed. Wrong repository id with corresponding task.(400)

>##### DELETE - /task/delete
>###### Delete task.
>body: {
>&emsp; task_id: xxx
>}
>
>return: {"detail": "Success:Successfully deleted the task."}
>
>###### Exception handle:
>Task id not found -> Task with corresponding id does not exist.(404)
>Task's creator not match -> Access denied. You are not allowed to delete other user's tasks.(403)