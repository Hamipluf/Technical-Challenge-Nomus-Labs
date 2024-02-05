# Simple Social Network Project

## Description

This project implements a Simple Social Network using Node.js and React.js, featuring basic functionalities such as user registration, login, user search, message posting, following and unfollowing other users, and a feed displaying posts from followed users. Additionally, it includes real-time notifications, direct messaging, and storage of messages in a PostgreSQL database.

## Technologies Used

- Node.js
- React.js
- PostgreSQL
- Socket.IO (WebSockets for direct messaging)

## Implemented Features

1. **Registration and Login:**
   - Allows users to register and log in.

2. **User Search:**
   - Users can search for others by username.

3. **Posting and Feed:**
   - Message posting.
   - Feed displaying posts from followed users.

4. **Follow/Unfollow:**
   - Users can follow and unfollow other users.

5. **Profile Privacy:**
   - Configuration of profiles as public or private.

6. **Comments and Likes:**
   - Comment system on posts.
   - Ability to give "likes" to posts.

7. **Notifications:**
   - Notifies users about new followers, comments, and "likes".
## API Documentation

Explore the API documentation at `/api-docs` for detailed information about the available endpoints and how to interact with them.

## Project Setup

1. **Backend:**
   - Install dependencies: `npm install`
   - Configure the database in `persistence/config.js`
   - Place your credentials in the env following env.example
   - Run the server: `npm start`

   
