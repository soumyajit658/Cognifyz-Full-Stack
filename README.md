# 🎓 Cognifyz Student Task Manager

A full-stack **Student Task Manager** developed as part of the **Cognifyz Full Stack Development Internship**.

The project demonstrates the implementation of frontend development, backend APIs, database integration, authentication, external API integration, rate limiting, background tasks, middleware, and server-side caching.

---

## 🚀 Features

- 👨‍🎓 Student registration and management
- 🔐 Secure user authentication using JWT
- 🔒 Password hashing using bcrypt
- 🗄️ MongoDB database integration
- 🌐 RESTful API for student management
- 🔌 External API integration
- 🛡️ API rate limiting
- 🔑 OAuth authorization flow concept demonstration
- ⏱️ Scheduled background tasks
- ⚡ Server-side caching
- ✅ Client-side and server-side validation
- 📱 Responsive frontend design
- 🎨 HTML, CSS and JavaScript interface
- 📄 EJS server-side rendering
- 🚨 Error handling and 404 handling

---

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript
- EJS

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication & Security
- JSON Web Token (JWT)
- bcrypt.js
- Express Rate Limit

### APIs & Server Features
- Axios
- External REST API
- node-cron
- node-cache
- Express Middleware

---

## 📚 Cognifyz Internship Tasks

This project covers all 8 tasks provided in the Cognifyz Full Stack Development Internship.

### Task 1 — HTML Structure and Basic Server Interaction
- Created the basic HTML structure.
- Implemented forms for student information.
- Created an Express.js server.
- Implemented server-side rendering using EJS.
- Added basic server endpoints.

### Task 2 — Form Interaction and Validation
- Added form validation.
- Implemented client-side JavaScript validation.
- Added server-side validation.
- Added validation for required fields and input values.

### Task 3 — Advanced CSS Styling and Responsive Design
- Created a responsive user interface.
- Applied CSS styling and layout techniques.
- Added responsive design for different screen sizes.
- Improved the overall appearance and usability of the application.

### Task 4 — Complex Form Validation and DOM Manipulation
- Implemented advanced validation rules.
- Added dynamic frontend interaction.
- Used JavaScript DOM manipulation.
- Added password validation and other input checks.

### Task 5 — API Integration and Frontend Interaction
- Created RESTful API endpoints.
- Implemented CRUD operations for students.
- Used JavaScript `fetch()` to communicate with the backend.
- Displayed API data dynamically on the frontend.

### Task 6 — Database Integration and Authentication
- Integrated MongoDB using Mongoose.
- Created a Student database model.
- Implemented student registration.
- Added password hashing using bcrypt.
- Implemented JWT-based authentication.
- Protected API routes using authentication middleware.

### Task 7 — Advanced API and External API Integration
- Integrated an external REST API.
- Used Axios for external API requests.
- Added API rate limiting.
- Added external API error handling.
- Added an OAuth authorization flow concept demonstration.

### Task 8 — Advanced Server-Side Functionality
- Implemented custom Express middleware.
- Added scheduled background tasks using `node-cron`.
- Added server-side caching using `node-cache`.
- Added 404 route handling.
- Added global server error handling.

---

## 📂 Project Structure

```text
Cognifyz-Full-Stack
│
├── jobs
│   └── dailyTask.js
│
├── middleware
│   └── cache.js
│
├── models
│   └── Student.js
│
├── services
│   └── externalApi.js
│
├── public
│   ├── script.js
│   └── style.css
│
├── views
│   └── index.ejs
│
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
