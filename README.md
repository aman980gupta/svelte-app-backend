this is basic backend for any appliction.
in it you can register your user with 4 field  first_name, last_name,email,password.
in this backend , there is 4 routes /login for login user and set cookies in headers, /register for sign up user , / logout for loging out user and clear cookies ,
and /profile route is only visitiable when user is login other wise he can not visite that route.
inserted object can be chande according to use.

to start this project 
run command in terminal npm run dev
then you can use thunder client or postman test api 
for register you can use this type of object in thunder client and method is post
{
"first_name":"aman",
"last_name":"gupta",
"password":"12345",
"email":"amana@mail.com"
}
for login you can use {"password":"12345","email":"amana@mail.com"} and method is post 
for logout you need to  use get method for testing api
