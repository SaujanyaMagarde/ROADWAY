# RoadWay API Documentation

## Overview
API documentation for the RoadWay application. This document provides details about available endpoints, request/response formats, and error handling.

## API Routes

### Authentication Routes
Base path: `/api/auth`

#### Register User
- **Endpoint:** `POST /api/auth/register`
- **Description:** Register a new user
- **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```
- **Success Response:**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "userId": "12345",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Login
- **Endpoint:** `POST /api/auth/login`
- **Description:** Authenticate user and get token
- **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Success Response:**
```json
{
  "status": "success",
  "token": "jwt_token_here",
  "user": {
    "userId": "12345",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### User Routes
Base path: `/api/users`

#### Get User Profile
- **Endpoint:** `GET /api/users/profile`
- **Description:** Get current user's profile
- **Headers Required:** Authorization Bearer Token
- **Success Response:**
```json
{
  "status": "success",
  "data": {
    "userId": "12345",
    "email": "user@example.com",
    "name": "John Doe",
    "profilePicture": "url_to_picture"
  }
}
```

#### Update Profile
- **Endpoint:** `PUT /api/users/profile`
- **Description:** Update user profile information
- **Headers Required:** Authorization Bearer Token
- **Request Body:**
```json
{
  "name": "Updated Name",
  "profilePicture": "new_picture_url"
}
```
- **Success Response:**
```json
{
  "status": "success",
  "message": "Profile updated successfully",
  "data": {
    "userId": "12345",
    "name": "Updated Name",
    "profilePicture": "new_picture_url"
  }
}
```

### Post Routes
Base path: `/api/posts`

#### Create Post
- **Endpoint:** `POST /api/posts`
- **Description:** Create a new post
- **Headers Required:** Authorization Bearer Token
- **Request Body:**
```json
{
  "title": "Post Title",
  "content": "Post content here",
  "image": "optional_image_url"
}
```
- **Success Response:**
```json
{
  "status": "success",
  "message": "Post created successfully",
  "data": {
    "postId": "67890",
    "title": "Post Title",
    "content": "Post content here",
    "image": "optional_image_url",
    "createdAt": "2023-01-01T00:00:00Z"
  }
}
```

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "status": "error",
  "message": "Error description here",
  "code": "ERROR_CODE"
}
```

### Common Error Codes
- `AUTH_REQUIRED`: Authentication is required
- `INVALID_CREDENTIALS`: Invalid login credentials
- `USER_EXISTS`: User already exists
- `VALIDATION_ERROR`: Invalid input data
- `NOT_FOUND`: Requested resource not found
- `SERVER_ERROR`: Internal server error

## Rate Limiting

API requests are limited to 100 requests per IP address per hour. Exceeding this limit will result in a 429 (Too Many Requests) response.

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Data Validation

All request data is validated before processing. Invalid data will result in a 400 Bad Request response with specific validation error messages.
