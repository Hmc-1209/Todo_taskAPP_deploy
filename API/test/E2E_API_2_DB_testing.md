### API testing for Todo_taskApp 

#### Preliminary actions -
1. Run `dummy_data_generator.sql` for initial some dummy data. Notice that all password in these users are not following the hashing rule in this API, so they cannot be authenticated.

***The test will be using the user created from first scenario and the "token" mentioned below all meant User1's authorization token.***

#### Overall test result - 
| Total Scenarios | Passes | Pass rate |
|-----------------|--------|-----------|
| 76              | 76     | 100%      |

#### Scenarios -
1. Create new user with name "User1", password "User1", birth date "2023-01-01"

2. Get the User1's authorization token (access_token)

3. Read user using User1's user id (Token❎)

4. Read user using User1's user id (Token✅)

5. Read user with unknown user id -1 (Token✅)

6. Read user with user id 1 (Token✅)

7. Read user id using name "User1" (Token❎)

8. Read user id using name "User1" (Token✅)

9. Read user id using name "DANNY HO" (Token✅)

10. Read user id using unknown name "name" (Token✅)

11. Read all users (Token✅)

12. Update User1's info: birthdate to "2022-12-31" (Token❎)

13. Update User1's info: birthdate to "2022-12-31" (Token✅)

14. Update DANNY HO's info: birthdate to "2022-12-31" (Token✅)

15. Update user's info: name to "name" with unknown id "-1" (Token✅)

16. Delete user "User1" (Token❎)

17. Delete user "User1" with incorrect password "User2" (Token✅)

18. Delete user "User1" with correct password "User1" (Token✅), recreate & get new token after checking it works

19. Delete user "DANNY HO" (Token✅)

20. Delete user with unknown id -1 (Token✅)

21. Create new repository "TestRepo" (Token❎)

22. Create new repository "TestRepo" (Token✅)

23. Create new repository for user id 1 (Token✅)

24. Create new repository for unknown user id -1 (Token✅)

25. Read all repositories of User1's id (Token❎)

26. Read all repositories of User1's id (Token✅)

27. Read all repositories of DANNY HO's id: 1 (Token✅)

28. Read all repositories of unknown user id: -1 (Token✅)

29. Update repository name "TestRepo" to "TestRepo2" (Token❎)

30. Update repository name "TestRepo" to "TestRepo2" (Token✅)

31. Update repository name with id 1 to "Testing" (Token✅)

32. Update repository name with unknown id -1 (Token✅)

33. Delete repository "TestRepo2" (Token❎)

34. Delete repository "TestRepo2" (Token✅), recreate it after checking it works

35. Delete repository "Homework" with repo id 1 (Token✅)

36. Delete repository with unknown repo id -1 (Token✅)

37. Create task "TestTask" to repo "TestRepo2" with corresponding user and repo id (Token❎)

38. Create task "TestTask" to repo "TestRepo2" with corresponding user and repo id (Token✅)

39. Create task "TestTask" to repo "TestRepo2" with corresponding repo id and user id -1 (Token✅)

40. Create task "TestTask" to repo "TestRepo2" with corresponding user id and repo id -1 (Token✅)

41. Create task "Testing" to repo "Homework" with repo id 1 (Token✅)

42. Create task "Testing" to user "DANNY HO" with user id 1 (Token✅)

43. Read all tasks with User1's user id (Token❎)

44. Read all tasks with User1's user id (Token✅)

45. Read all tasks with user id 1 (Token✅)

46. Read all tasks with unknown user id -1 (Token✅)

47. Read all tasks with TestRepo2's repo id (Token❎)

48. Read all tasks with TestRepo2's repo id (Token✅)

49. Read all tasks with repo id 1 (Token✅)

50. Read all tasks with unknown repo id -1 (Token✅)

51. Update task with TestTask's task id, change task_finish to 1 (Token❎)

52. Update task with TestTask's task id, change task_finish to 1 (Token✅)

53. Update task with task id 1, change task_finish to 1 (Token✅)

54. Update task with unknown task id -1, change task_finish to 1 (Token✅)

55. Delete task with TestTask's task id (Token❎)

56. Delete task with TestTask's task id (Token✅)

57. Delete task with task id 1 (Token✅)

58. Delete task with unknown id -1 (Token✅)

59. Create tag "TestTag" using User1's user id, belongs to TestRepo2's repo id (Token❎)

60. Create tag "TestTag" using User1's user id, belongs to TestRepo2's repo id (Token✅)

61. Create tag "TestTag" using user id 1, belongs to TestRepo2's repo id (Token✅)

62. Create tag "TestTag" using unknown user id -1, belongs to TestRepo2's repo id (Token✅)

63. Create tag "TestTag" using User1's user id, belongs to repo id 1 (Token✅)

64. Create tag "TestTag" using User1's user id, belongs to repo id -1 (Token✅)

65. Read all tags using TestRepo2's repo id (Token❎)

66. Read all tags using TestRepo2's repo id (Token✅)

67. Read all tags using repo id 1 (Token✅)

68. Read all tags using unknown repo id -1 (Token✅)

69. Update tag using TestTag's tag id (Token❎)

70. Update tag using TestTag's tag id (Token✅)

71. Update tag using tag id 1 (Token✅)

72. Update tag using unknown tag id -1 (Token✅)

73. Delete tag using TestTag's tag id (Token❎)

74. Delete tag using TestTag's tag id (Token✅)

75. Delete tag using tag id 1 (Token✅)

76. Delete tag using unknown tag id -1 (Token✅)


#### Testing result - 
[API test file](./E2E_API_2_DB_testing.xlsx)
