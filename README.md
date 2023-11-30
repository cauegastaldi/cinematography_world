# Cinematography World
This project consists of building a system with back-end and front-end for reviewing movies and tv shows.

## 📋 Table of Contents
 - [Features](#-features)
 - [Technologies used](#-technologies)
 - [Installation](#installation)
 - [Routes](#routes)

## 🚀 Features
 - User (Admin or Normal) registration and login with JWT.
 - Edit user profile information and update database.
 - Movie / Tv Show registration, edition and deletion updating the database.
 - Review registration, edition and deletion updating the database.

## 🛠️ Technologies used
 - Node.JS
 - React.JS
 - Sequelize: Is a based Node.JS ORM for Postgres, MySQL, MariaDB, SQLite, Microsoft SQL Server, Oracle Database, Amazon Redshift and Snowflake’s Data Cloud.
 - React Hook Form: Is a form validation library.
 
## Installation back-end
1. Run the `npm i` or `npm install` command on the back-end folder to install the libraries used in the project. 
2. MySQL: You must have a mysql server on your machine.
3. Env file: Create a .env file and add the variables:
  3.1. `DB_NAME`: variable that contains the name of the database that is going to be used.
  3.2. `DB_USER`: variable that contains the name of the user that will use the database.
  3.3. `DB_PASSWORD`: variable that contains the password of the user that will use the database.
  3.4. `DB_HOST`: variable that contains the url of the server host.
    3.4.1 E.g: `DB_HOST="localhost"`
4. Then, to create an administrator to initially access the system, run `npm run createAdmin`, after executing the command in the terminal it will create a administrator with username "caue" and password "caue".
5. To run the project, run the command `npm run dev` and then the server will be running at http://localhost:8000.

## Routes back-end
- `/medias` It is a route that contains all HTTP verbs to manage medias.
- `/auth` It is a route for mananing the user authentication.
- `/reviews` It is a route that contains all HTTP verbs to manage reviews made by the users.
- `/users` It is a route that contains all HTTP verbs to manage users.
- `/upload` It is a route that serves static files such as user icon and medias posters.
