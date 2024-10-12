# Chat Application

This is a simple application which provides web services to facilitate group chat and manage data.

## Prerequisites

- Node.js version 20.17.0
- MongoDB

## Setup

1. Clone the repository:

   ```
   git clone https://github.com/atanwer/chat-app.git
   cd chat-app
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up the MongoDB database:

   - Start your MongoDB server
   - Connect to your MongoDB database
   - Create an admin user by inserting the following document into the `users` collection:

   ```json
   {
     "username": "AKalesh T",
     "email": "akalesht@gmail.com",
     "password": "$2a$12$0mzbVSpWAY8maDF2nABqo.dvEd9VycgpElxjpaB4P.xFM2XSWwbrG", // password is akaleshT for admin
     "isAdmin": true
   }
   ```

4. Create a `.env` file in the root directory with the following content:
   ```
   MONGODB_URI=mongodb://localhost:27017/chat-app
   JWT_SECRET=your_secret_key
   JWT_EXPIRES_IN=1d
   PORT=3000
   ```

## Running the Application

- For production:

  ```
  npm start
  ```

- For development:
  ```
  npm run dev
  ```

## Features

- Admin APIs (only admin can add users)
  - Manage Users (create user, edit user)
- Any User (normal user, admin user)
  - Authentication APIs (login, logout)
- Groups (Normal User)
  - Manage groups (create, delete, search and add members, etc)
  - All users are visible to all users
- Group Messages (Normal User)
  - Send messages in group
  - Like messages, etc

## Testing

To run the e2e tests:

```
npm test
```
