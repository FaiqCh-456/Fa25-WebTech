# BeLeasing - Full Stack Car Leasing Application

A robust, full-stack web application for a luxury car leasing company. This project converts a static HTML/CSS design into a dynamic **Express.js** application with a **MongoDB** database, user authentication, and an admin dashboard.

## 🚀 Features

* **Dynamic Content:** Car listings are fetched from a MongoDB database, not hardcoded HTML.
* **User Authentication:** Secure Login and Registration system using JWT (JSON Web Tokens) and bcrypt encryption.
* **Admin Dashboard (CRUD):** authenticated users can Add, View, and Delete cars from the inventory.
* **Real-time Filtering:** Filter the inventory on the dashboard by Name, Category, or Price instantly.
* **Security:** Implements `helmet` for secure headers, `express-rate-limit` to prevent brute force attacks, and `express-validator` for input sanitation.
* **Contact API:** Functional contact form that saves inquiries to the database via an internal API.
* **Templating:** Modular Views using EJS (Embedded JavaScript) with reusable Partials (Navbar, Footer).

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Frontend:** EJS, Bootstrap 5, Vanilla JS, Custom CSS
* **Auth:** JWT, Cookies, Bcrypt.js

## 📂 Folder Structure

```text
beleasing-fullstack/
├── public/             # Static assets (CSS, JS, Images)
├── server/
│   ├── config/         # Database connection
│   ├── controllers/    # Logic for Auth, Cars, and Contact
│   ├── models/         # Mongoose Schemas (User, Car, Contact)
│   ├── routes/         # API and View routes
│   └── server.js       # App entry point
├── views/              # EJS Templates
│   ├── layouts/        # Header/Footer wrappers
│   ├── partials/       # Reusable components (Navbar)
│   └── ...             # Page templates (index, offer, crud, etc.)
└── .env                # Environment variables