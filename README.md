
**Real time flight board with JWT Authentication**

This project is a real-time Flight Management system built with .NET Core 7, Angular, and SignalR. 
It allows authenticated users to search for flights,
 filter by status or destination, add new flights with validation, and view live updates across all clients when flights are added or deleted.

**🔐 Authentication & Authorization**
JWT-based authentication — only logged-in users can access the app.

Auth Guard — Angular route protection ensures routes like /flight-board are accessible only with a valid token.

HTTP Interceptor — automatically attaches the JWT to every outgoing request except for login.

**⚙️ Backend API Endpoints**
Method	Endpoint	Description
GET	/api/Flight	Search flights by status and/or destination
POST	/api/Flight	Add a new flight with validation
DELETE	/api/Flight/{id}	Delete a flight by ID

All endpoints return a standard response structure including message, data, and HTTP statusCode.

📡 SignalR Integration
Real-Time Updates:

When a flight is added or deleted, the server broadcasts the change using SignalR.

All connected clients update their UI instantly without polling.

Hub Endpoint: /hubs/flightHub

🧭 Frontend Features
✅ Flight Board (/flight-board)
Protected by AuthGuard, accessible only with a valid JWT.

Displays flights in a table with:

Flight Number

Destination

Departure Time

Gate

Status (calculated client-side)

Status updates automatically every 2 minutes.


🔍 Search & Filter
Filter by status via dropdown.

Filter by destination via free-text.

Clear Filters button resets the view.

All filtering is performed client-side.

➕ Add Flight Form
Form fields:

Flight Number

Destination

Departure Date

Gate

Includes validation:

Required fields

Departure must be in the future

On submission:

API request adds the flight

SignalR updates other clients in real-time

🛠️ Setup Instructions

SERVER_BASE_API_URL: 'https://localhost:7051/api/',
SIGNALR_HUB_URL: 'https://localhost:7051/hubs/flightHub'
Run ng serve.


🧑‍💻**How to Use:**

Login and Get Token (Angular Frontend - /login):
o	Navigate to the /login page in the Angular application.
o	Provide your username and password in the login form.

**{
  "username": "testuser",
  "password": "Pass1357!"
}**

o	Upon successful authentication, the API will return a JWT token. This token is typically stored in the browser's local storage or session storage by the Angular application.
o	Important: The obtained JWT token expires after 20 minutes.


Accessing Protected Endpoints (Angular Frontend - Automatic via Interceptor):
o	For all subsequent API requests made from the Angular application (except /api/auth/login), the Angular HTTP interceptor will automatically include the JWT token in the Authorization header as a Bearer token.
o	Header: Authorization: Bearer <jwt_token>


Token is stored in localStorage.

AuthInterceptor attaches the token to every request.
