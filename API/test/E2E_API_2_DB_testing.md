### API testing for Todo_taskApp 

#### Preliminary actions -
1. Run `dummy_data_generator.sql` for initial some dummy data. Notice that all password in these users are not following the hashing rule in this API, so they cannot be authenticated.

***The test will be using the user created from first scenario and the "token" mentioned below all meant User1's authorization token.***

#### Overall test result - 
| Total Scenarios | Passes | Pass rate |
|-----------------|--------|-----------|
| 71              |        |           |

#### Scenarios - 
0. Create new user with name "User1", password "User1", birth date "2023-01-01"  

1. Get the User1's authorization token (access_token)

2. Read user using User1's user id (Token❎)

3. Read user using User1's user id (Token✅)

4. Read user with unknown user id (Token✅)

5. Read user with user id 1 (Token✅)

6. Read user id using name "User1" (Token✅)

7. Read user id using name "DANNY HO" (Token✅)

8. Read user id using unknown name "name" (Token✅)

9. Read all users (Token✅)

10. Update User1's info: birthdate to "2022-12-31" (Token❎)

11. Update User1's info: birthdate to "2022-12-31" (Token✅)

12. Update DANNY HO's info: birthdate to "2022-12-31" (Token✅)

13. Update user's info: name to "name" with unknown id "-1" (Token✅)

14. Delete user "User1" (Token❎)

15. Delete user "User1" with incorrect password "User2" (Token✅)

16. Delete user "User1" with correct password "User1" (Token✅), recreate & get new token after checking it works

17. Delete user "DANNY HO" (Token✅)

18. Delete user with unknown id -1 (Token✅)

19. Create new repository "TestRepo" (Token❎)

20. Create new repository "TestRepo" (Token✅)

21. Create new repository for user id 1 (Token✅)

22. Create new repository for unknown user id -1 (Token✅)

23. Read all repositories of User1's id (Token❎)

24. Read all repositories of User1's id (Token✅)

25. Read all repositories of DANNY HO's id: 1 (Token✅)

26. Read all repositories of unknown user id: -1 (Token✅)

27. Update repository name "TestRepo" to "TestRepo2" (Token❎)

28. Update repository name "TestRepo" to "TestRepo2" (Token✅)

29. Update repository name with id 1 to "Testing" (Token✅)

30. Update repository name with unknown id -1 (Token✅)

31. Delete repository "TestRepo2" (Token❎)

32. Delete repository "TestRepo2" (Token✅), recreate it after checking it works

33. Delete repository "Homework" with repo id 1 (Token✅)

34. Delete repository with unknown repo id -1  (Token✅)

35. Create task "TestTask" to repo "TestRepo2" with corresponding id (Token❎)

36. Create task "TestTask" to repo "TestRepo2" with corresponding id (Token✅)

37. Create task "Testing" to repo "Homework" with repo id 1 (Token✅)

38. Create task "Testing" to repo with unknown id -1 (Token✅)

39. Read all tasks with User1's user id (Token❎)

40. Read all tasks with User1's user id (Token✅)

41. Read all tasks with user id 1 (Token✅)

42. Read all tasks with unknown user id -1 (Token✅)

43. Read all tasks with TestRepo2's repo id (Token❎)

44. Read all tasks with TestRepo2's repo id (Token✅)

45. Read all tasks with repo id 1 (Token✅)

46. Read all tasks with unknown repo id -1 (Token✅)

47. Update task with TestTask's task id, change task_finish to 1 (Token❎)

48. Update task with TestTask's task id, change task_finish to 1 (Token✅)

49. Update task with task id 1, change task_finish to 1 (Token✅)

50. Update task with unknown task id -1, change task_finish to 1 (Token✅)

51. Delete task with TestTask's task id (Token❎)

52. Delete task with TestTask's task id (Token✅)

53. Delete task with task id 1 (Token✅)

54. Delete task with unknown id -1 (Token✅)

55. Create tag "TestTag" using User1's user id, belongs to TestRepo2's repo id (Token❎)

56. Create tag "TestTag" using User1's user id, belongs to TestRepo2's repo id (Token✅)

57. Create tag "TestTag" using user id 1, belongs to TestRepo2's repo id (Token✅)

58. Create tag "TestTag" using unknown user id -1 , belongs to TestRepo2's repo id (Token✅) 

59. Read all tags using TestRepo2's repo id (Token❎)

60. Read all tags using TestRepo2's repo id (Token✅)

61. Read all tags using repo id 1 (Token✅)

62. Read all tags using unknown repo id -1 (Token✅)

63. Update tag using TestTag's tag id (Token❎)

64. Update tag using TestTag's tag id (Token✅)

65. Update tag using tag id 1 (Token✅)

66. Update tag using unknown tag id -1 (Token✅)

67. Delete tag using TestTag's tag id (Token❎)

68. Delete tag using TestTag's tag id (Token✅)

69. Delete tag using tag id 1 (Token✅)

70. Delete tag using unknown tag id -1 (Token✅)

#### Testing result - 
| Scenario | Step(s) | Expected Output | Output | Result |
|----------|---------|-----------------|--------|--------|
| 0        |         |                 |        |        |
| 1        |         |                 |        |        |
| 2        |         |                 |        |        |
| 3        |         |                 |        |        |
| 4        |         |                 |        |        |
| 5        |         |                 |        |        |
| 6        |         |                 |        |        |
| 7        |         |                 |        |        |
| 8        |         |                 |        |        |
| 9        |         |                 |        |        |
| 10       |         |                 |        |        |
| 11       |         |                 |        |        |
| 12       |         |                 |        |        |
| 13       |         |                 |        |        |
| 14       |         |                 |        |        |
| 15       |         |                 |        |        |
| 16       |         |                 |        |        |
| 17       |         |                 |        |        |
| 18       |         |                 |        |        |
| 19       |         |                 |        |        |
| 20       |         |                 |        |        |
| 21       |         |                 |        |        |
| 22       |         |                 |        |        |
| 23       |         |                 |        |        |
| 24       |         |                 |        |        |
| 25       |         |                 |        |        |
| 26       |         |                 |        |        |
| 27       |         |                 |        |        |
| 28       |         |                 |        |        |
| 29       |         |                 |        |        |
| 30       |         |                 |        |        |
| 31       |         |                 |        |        |
| 32       |         |                 |        |        |
| 33       |         |                 |        |        |
| 34       |         |                 |        |        |
| 35       |         |                 |        |        |
| 36       |         |                 |        |        |
| 37       |         |                 |        |        |
| 38       |         |                 |        |        |
| 39       |         |                 |        |        |
| 40       |         |                 |        |        |
| 41       |         |                 |        |        |
| 42       |         |                 |        |        |
| 43       |         |                 |        |        |
| 44       |         |                 |        |        |
| 45       |         |                 |        |        |
| 46       |         |                 |        |        |
| 47       |         |                 |        |        |
| 48       |         |                 |        |        |
| 49       |         |                 |        |        |
| 50       |         |                 |        |        |
| 51       |         |                 |        |        |
| 52       |         |                 |        |        |
| 53       |         |                 |        |        |
| 54       |         |                 |        |        |
| 55       |         |                 |        |        |
| 56       |         |                 |        |        |
| 57       |         |                 |        |        |
| 58       |         |                 |        |        |
| 59       |         |                 |        |        |
| 60       |         |                 |        |        |
| 61       |         |                 |        |        |
| 62       |         |                 |        |        |
| 63       |         |                 |        |        |
| 64       |         |                 |        |        |
| 65       |         |                 |        |        |
| 66       |         |                 |        |        |
| 67       |         |                 |        |        |
| 68       |         |                 |        |        |
| 69       |         |                 |        |        |
| 70       |         |                 |        |        |

