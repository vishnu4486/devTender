#devTinder
##authRouter
-- -POST /signup  
-- -POST /login
-- -POST /logout

##ProfileRouter
-- -GET /profile/view
-- -PATCH /profile/edit
-- PATCH /profile/password


##connectionRequestRouter
-- -POST /request/send/intrested/:useId
-- -POST /request/send/ignore/:useId

-- -POST /request/review/accepat/:requestId
-- -POST /request/review/rejected/:requestId

##user 
-GET /user/connections
-GET /user/request/recived
-- -GET /user/feed -Gets you the profile of other users on platform 

Status: ignore,intrested,accepated,regected
