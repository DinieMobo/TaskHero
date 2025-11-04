# TaskHero: Web-Based Task Manager App

Welcome to TaskHero, a robust and intuitive web-based task management application designed to help individuals and teams organize, track, and complete their tasks efficiently. With a focus on user experience and comprehensive features, TaskHero provides a centralized platform for all your productivity needs.

## Project Overview

TaskHero is a full-stack web application built to streamline task management. It offers a clean, responsive interface for users to create, assign, track, and manage tasks through various stages. The application supports user authentication, role-based access, and real-time updates, making it an ideal solution for personal use or small to medium-sized teams.

## Key Features

- **User Authentication & Authorization**
    - Secure login, registration, password reset (via OTP), and role-based access control (Admin/Employee)

- **Comprehensive Task Management**
    - Create, view, update, and delete tasks
    - Define task priority (High, Medium, Normal, Low) and stage (To Do, In Progress, Completed)
    - Add and manage subtasks for detailed breakdown
    - Track task activities and comments
    - Attach assets/files to tasks (powered by Cloudinary)
    - Assign tasks to team members
    - "Trash" functionality for soft-deleting tasks

- **Multiple Task Views**
    - Switch between a visual Board View (Kanban-style) and a traditional List View for tasks

- **Interactive Dashboard**
    - Quick overview of total tasks, completed tasks, tasks in progress, and To-Dos
    - Task chart by priority and recent tasks/users (for administrators)

- **User Management (Admin Role)**
    - Administrators can manage user accounts, including activation status

- **Notifications**
    - System for displaying important messages and updates

- **Theme Customization**
    - Toggle between light and dark modes for a personalized experience

- **Responsive Design**
    - Optimized for seamless use across various devices (desktop, tablet, mobile)

## Technologies Used

TaskHero is built using a modern MERN stack (MongoDB, Express.js, React.js, Node.js) along with other powerful libraries and tools:

### Frontend
- **React.js**: For building dynamic and interactive user interfaces
- **Redux Toolkit**: For efficient state management
- **React Router DOM**: For declarative routing
- **Tailwind CSS**: For rapid and responsive UI development
- **Vite**: As a fast build tool for the frontend
- **Recharts**: For creating interactive data visualizations on the dashboard
- **Sonner**: For elegant toast notifications
- **Cloudinary**: For cloud-based image and video management (file uploads)

### Backend
- **Node.js & Express.js**: For building a robust RESTful API
- **MongoDB**: NoSQL database for storing application data (via Mongoose ODM)
- **Mongoose**: MongoDB object data modeling (ODM) for Node.js
- **JSON Web Tokens (JWT)**: For secure user authentication
- **Bcrypt.js**: For hashing passwords securely
- **Resend**: For sending transactional emails (e.g., password reset OTP)
- **CORS**: For enabling cross-origin requests
- **Dotenv**: For managing environment variables

## Step-by-Step Setup Instructions

Follow these instructions to get TaskHero up and running on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: Version 18.x or higher (LTS recommended)
- **npm**: Node Package Manager, which comes bundled with Node.js
- **MongoDB**: A running instance of MongoDB. You can install it locally or use a cloud-based service like MongoDB Atlas:
    - [MongoDB Community Edition](https://www.mongodb.com/try/download/community)
    - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud-based, free tier available)
- **Git**: For cloning the repository

### 1. Clone the Repository

First, clone the TaskHero repository to your local machine:

```bash
git clone https://github.com/DinieMobo/TaskHero.git
cd TaskHero
```


You can also download the Entire Repository as a ZIP file and extract it.

### 2. Install Dependencies

The project is divided into two main parts: client (frontend) and server (backend). You need to install dependencies for both.

**For the Backend**:
Navigate into the server directory and install the Node.js dependencies:

```bash
cd server
npm install
```

**For the Frontend**:
Navigate into the client directory and install the Node.js dependencies:

```bash
cd ../client
npm install
```

### 3. Configure Environment Variables

Both the backend and frontend require environment variables for configuration. Create `.env` files in both the server and client directories.

**Backend (server/.env)**:
Create a file named `.env` in the server directory and add the following variables. Replace the placeholder values with your actual credentials and settings:

```
CLIENT_URL = "http://localhost:3000" #You can change the port 3000 to your own port number.
MONGODB_URI = "your_mongodb_connection_string"
JWT_SECRET = "a_strong_random_secret_key_for_jwt"
RESEND_API = "your_resend_api_key"
PORT = 8800 #You can change the port 8800 to your own port number.
```

- **PORT**: The port on which the backend server will run. 8800 is the default expected by the frontend.
- **MONGODB_URI**: Your MongoDB connection string. For a local MongoDB instance, it might look like `mongodb://localhost:27017/taskhero`. If using MongoDB Atlas, copy your connection string from the Atlas dashboard.
- **JWT_SECRET**: A strong, random string used to sign and verify JSON Web Tokens. Generate a long, complex string for this.
- **RESEND_API**: Your API key from Resend for sending emails (e.g., password reset OTPs).

**Frontend (client/.env)**:
Create a file named `.env` (or `.env.local` for Vite) in the client directory and add the following variables:

```
VITE_APP_BASE_URL = http://localhost:8800
VITE_CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
```

- **VITE_APP_BASE_URL**: The URL of your backend API. If you changed the PORT in server/.env, update this accordingly.
- **VITE_CLOUDINARY_CLOUD_NAME**: Your Cloudinary cloud name. This is used for direct file uploads from the client. You can find this in your Cloudinary Dashboard.

### 4. Run the Application

Once all dependencies are installed and environment variables are configured, you can start both the backend and frontend servers.

**Start the Backend Server**:
Navigate back to the server directory and run the start script:

```bash
cd server
npm start
```

The server should start on the port you specified (defaulting to 8800). You should see a "Database Connected" message in your console if MongoDB is set up correctly.

**Start the Frontend Development Server**:
Open a new terminal window, navigate to the client directory, and run the development script:

```bash
cd client
npm run dev
```

This will start the frontend development server, typically on http://localhost:5173.

### 5. Access the Application

Open your web browser and navigate to http://localhost:5173 (or the port indicated by your frontend server). You should see the TaskHero login page.

You can now register a new account or log in if you have existing credentials.

Enjoy using TaskHero to manage your tasks!

## Contact

For any questions or support, please reach out via email: dinisayuranga@gmail.com
