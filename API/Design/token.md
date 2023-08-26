#### API designs for create token
   
>##### POST - /token/access_token
>###### Generate access_token
>body: {
>&emsp;user_name: xxx,
>&emsp;user_password: xxxx
>} 
>
>return: {
>&emsp;access_token: xxxxxx
>}
>###### Exception handle:
>User not found -> User with corresponding name does not exist.(404)
>User's password not match -> Password incorrect.(403)

>##### GET - /token/refresh_token
>###### Generate refresh_token
>body: {
>&emsp;user_name: xxx,
>&emsp;user_password: xxxx
>} 
>
>return: {
>&emsp;refresh_token: xxxxxx
>}
>###### Exception handle:
>User not found -> User with corresponding name does not exist.(404)
>User's password not match -> Password incorrect.(403)

>##### GET - /token/validate_access_token
>###### Validate access_token's avalibility
>header: {
>&emsp;Authentication: "Bearer "+ xxxxxx
>}
>
>body: N / A
>
>return: {
>&emsp;valid: T / F
>}
>###### Exception handle:
>Token type not acceptable -> Access token type not acceptable.(400)

>##### GET - /token/validate_refresh_token
>###### Validate refresh_token's avalibility
>header: {
>&emsp;Authentication: "Bearer "+ xxxxxx
>}
>
>body: N / A
>
>return: {
>&emsp;valid: T / F
>}
>###### Exception handle:
>Token type not acceptable -> Refresh token type not acceptable.(400)