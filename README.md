# Playo_clone
<h1>Playo</h1>
<h2>Dependencies</h2>

<h3>"bcrypt": "^5.1.0",
<h3> "cors": "^2.8.5",
  <h3>  "dotenv": "^16.0.3",
   <h3> "express": "^4.18.2",
  <h3>  "jsonwebtoken": "^9.0.0",
  <h3>  "mongoose": "^7.0.1",
   <h3> "nodemon": "^2.0.21"
   </br>
   <hr>
   </br>
   
   <h2>End Points</h2><h3>/signup
   
 <h3>/user/signup
   
 <h3>/user/login
   
<h3>/event/create

<h3>/event

<h3>/event/:id

<h3>/event/getmyevents

<h3>/event/requesttojoin/:id

<h3>/event/approve-request/:eventId/:requestId

<h3>/event/pendingrequests/:id

<h3>/event/cancel/:eventId

</br>
  <hr>
   <h2>Details</h2>

<h4>
<li>The /user/signup expects a POST request with the fields username and password in the requst body. It creates a new Usermodel document and saves it to the database.
</br>
</br>
<li>The /user/login expects a POST request with the fields username and passwords in the requst body. It creates a new Usermodel document and saves it to the database.
</br>
</br>
<li>The /create route expects a POST request with the fields game, information, startTime, maxPlayers, and userId in the request body. It matched this in database to authenticate user and provides token.
</br>
</br>
<li>The / route expects a GET request and returns all Event documents sorted by startTime in ascending order.
</br>
</br>
<li>The /:id route expects a GET request with the id of an Event document in the URL parameter. It returns the details of the event, including the game, information, startTime, maxPlayers, createdBy, and acceptedRequests.
</br>
</br>
<li>The /getmyevents route expects a GET request with the userId of the user in the request body. It returns all Event documents created by the user sorted by startTime in ascending order.
</br>
</br>
<li>The /requesttojoin/:id route expects a POST request with the id of an Event document in the URL parameter and the userId of the user in the request body. It adds the userId to the pendingRequests array of the Event document if the user has not already joined or requested to join the event.
</br>
</br>
<li>The /approve-request/:eventId/:requestId route expects a POST request with the eventId and requestId of an Event document and a pending request, respectively, in the URL parameters, as well as the userId of the user approving the request in the request body. It adds the requestId to the acceptedRequests array of the Event document and removes it from the pendingRequests array.
</br>
</br>
<li>The /pendingrequests/:id route expects a GET request with the id of an Event document in the URL parameter and the userId of the user in the request body. It returns the pending requests for the Event document.
</br>
</br>
<li> /event/cancel/:eventId route expects a PUT request with id of an Event document in the URL parameter and the userId of the user in the request body. It checks the request in both pending and accepted arrays and delete from there.
</h4>
<br>
<br>

<h3>user/signup
<h4>Method: POST
<h4>Description: Creates a new user account.
<h4>Request body:
username: string, required
password: string, required
<h3>/user/login
<h4>Method: POST
<h4>Description: Authenticates a user.
<h4>Request body:
username: string, required
password: string, required
<h3>/event/create
<h4>Method: POST
<h4>Description: Creates a new event.
<h4>Request body:
game: string, required
information: string, required
startTime: Date, required
maxPlayers: number, required
userId: string, required
<h3>/event
<h4>Method: GET
<h4>Description: Returns all events sorted by start time in ascending order.
<h3>/event/:id
<h4>Method: GET
<h4>Description: Returns the details of an event.
URL parameter: id, string, required
<h3>/event/getmyevents
<h4>Method: GET
<h4>Description: Returns all events created by the user sorted by start time in ascending order.
<h4>Request body:
userId: string, required
<h3>/event/requesttojoin/:id
<h4>Method: POST
<h4>Description: Adds a user to the pending requests array of an event.
<h4>URL parameter: id, string, required
<h4>Request body:
userId: string, required
<h3>/event/approve-request/:eventId/:requestId
<h4>Method: POST
<h4>Description: Approves a pending request to join an event and adds the user to the accepted requests array.
<h4>URL parameter: eventId, string, required, requestId, string, required
<h4>Request body:
userId: string, required
<h3>/event/pendingrequests/:id
<h4>Method: GET
<h4>Description: Returns the pending requests for an event.
<h4>URL parameter: id, string, required
<h4>Request body:
userId: string, required
<h3>/event/cancel/:eventId
<h4>Method: PUT
<h4>Description: Deletes the user's request to join or accepted request from an event.
<h4>URL parameter: eventId, string, required
<h4>Request body:
userId: string, required
