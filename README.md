# Chat Application

This is a simple application which provides web services to facilitate group chat and manage data.

## Prerequisites

- Node.js version 20.17.0
- MongoDB

## Setup

1. Clone the repository:

   ```
   git clone <repository-url>
   cd <repository-name>
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

   Note: The password in this example is hashed. In a real-world scenario, you would typically create users through the application's user management interface, which would handle password hashing securely.

4. Create a `.env` file in the root directory with the following content:
   ```
   MONGODB_URI=mongodb://localhost:27017/your_database_name
   JWT_SECRET=your_secret_key
   JWT_EXPIRES_IN=1d
   PORT=3000
   ```
   Replace `your_database_name` and `your_secret_key` with appropriate values.

## Running the Application

- For production:

  ```
  npm start
  ```

- For development (with hot reloading):
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

## API Documentation

[Include API documentation or link to it here]

## Contributing

[Include contribution guidelines here]

## License

[Include license information here]
