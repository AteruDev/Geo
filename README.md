# 📍 GeoPin

GeoPin is a web-based location management application that allows users to [describe the main goal: e.g., "securely drop, save, and manage location pins on a map"]. This project demonstrates full-stack development skills using **Node.js** for the backend and **Prisma** for database management.

## 🚀 Features

* **User Authentication:** Secure login and registration system [mention if using JWT or Sessions].
* **Location Pinning:** Users can [create/read/update/delete] location pins.
* **Interactive Dashboard:** A user-friendly interface to view saved locations.
* **Backend API:** RESTful API built with Node.js to handle data requests.
* **Database ORM:** Utilizes Prisma for efficient database schema modeling and queries.

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js (implied)
* **Database:** Prisma ORM (connected to [PostgreSQL/MySQL/SQLite?])
* **Frontend:** HTML5, CSS3, JavaScript
* **Tools:** VS Code, Git

## 📂 Project Structure
geopin-backend/
├── middleware/      # Authentication & logic middleware
├── prisma/          # Database schema and migrations
├── public/          # Frontend assets (HTML, CSS, JS)
├── .env             # Environment variables
├── index.js         # Entry point for the server
└── package.json     # Dependencies

⚙️ Installation & Setup
Follow these steps to run the project locally:

1. Clone the repository

Bash

git clone [https://github.com/meglopez2604/geopin.git](https://github.com/meglopez2604/geopin.git)
cd geopin
2. Install dependencies

Bash

npm install
3. Configure Environment Variables Create a .env file in the root directory and add your database credentials:

Code snippet

DATABASE_URL="your_database_connection_string_here"
PORT=3000
# Add any other secrets here
4. Setup the Database Push the Prisma schema to your database:

Bash

npx prisma db push
5. Run the Server

Bash

node index.js
The app will be running at http://localhost:3000.
