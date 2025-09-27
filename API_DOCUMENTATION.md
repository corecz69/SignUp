# Sign Language Learning Application - API Documentation

## Overview

This REST API provides comprehensive functionality for managing and searching sign language content. The API is built with Spring Boot and includes advanced search capabilities, component-based filtering, and optimized performance.

## Base URL
```
http://localhost:8080/api
```

## Authentication

The API uses JWT (JSON Web Token) authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Core Endpoints

### Authentication

#### POST /auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": "uuid",
  "name": "User Name",
  "email": "user@example.com",
  "role": "STUDENT"
}
```

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123",
  "role": "STUDENT"
}
```

#### GET /auth/me
Get current user information.

**Response:**
```json
{
  "id": "uuid",
  "name": "User Name",
  "email": "user@example.com",
  "role": "STUDENT"
}
```

### Advanced Search System

#### GET /search/signs
Advanced search with multiple filter criteria.

**Query Parameters:**
- `query` (string): Text search across translations and explanations
- `categoryId` (UUID): Filter by category
- `signType` (enum): BASIC, COMPOUND, FINGERSPELLING
- `languageLevel` (enum): BEGINNER, INTERMEDIATE, ADVANCED
- `region` (enum): CZECH, SLOVAKIA, MORAVIA
- `handShapeId` (UUID): Filter by hand shape component
- `locationId` (UUID): Filter by location component
- `movementId` (UUID): Filter by movement component
- `palmOrientationId` (UUID): Filter by palm orientation
- `fingerOrientationId` (UUID): Filter by finger orientation
- `contactRegionId` (UUID): Filter by contact region
- `handArrangementId` (UUID): Filter by hand arrangement
- `page` (int): Page number (0-based)
- `size` (int): Page size (default: 20)

**Example Request:**
```
GET /search/signs?query=dobrý&signType=BASIC&languageLevel=BEGINNER&page=0&size=12
```

**Response:**
```json
{
  "content": [
    {
      "id": "uuid",
      "translations": ["dobrý", "good"],
      "explanation": "Znak pro vyjádření pozitivního hodnocení",
      "videoFileName": "good_sign.mp4",
      "category": {
        "id": "uuid",
        "name": "Adjektiva"
      },
      "type": "BASIC",
      "languageLevel": "BEGINNER",
      "region": "CZECH"
    }
  ],
  "totalElements": 25,
  "totalPages": 3,
  "number": 0,
  "size": 12
}
```

#### GET /search/signs/quick
Quick text search across translations and explanations.

**Query Parameters:**
- `query` (string, required): Search term
- `page` (int): Page number
- `size` (int): Page size

**Example:**
```
GET /search/signs/quick?query=čísla&page=0&size=10
```

#### GET /search/signs/similar-movement
Find signs with similar movement patterns.

**Query Parameters:**
- `signId` (UUID, required): Reference sign ID
- `page` (int): Page number
- `size` (int): Page size

**Example:**
```
GET /search/signs/similar-movement?signId=123e4567-e89b-12d3-a456-426614174000
```

#### GET /search/suggestions
Get search suggestions for autocomplete.

**Query Parameters:**
- `query` (string, required): Partial search term (minimum 2 characters)

**Response:**
```json
[
  "dobrý den",
  "dobrý večer",
  "dobré ráno"
]
```

### Sign Management

#### GET /sign
Get paginated list of signs.

**Query Parameters:**
- `page` (int): Page number
- `size` (int): Page size
- `sort` (string): Sort criteria

#### GET /sign/{id}
Get detailed sign information.

**Response:**
```json
{
  "id": "uuid",
  "translations": ["hello", "ahoj"],
  "explanation": "Základní pozdrav",
  "videoFileName": "hello.mp4",
  "category": {
    "id": "uuid",
    "name": "Pozdravy"
  },
  "type": "BASIC",
  "languageLevel": "BEGINNER",
  "region": "CZECH",
  "handShape": {
    "id": "uuid",
    "name": "Open Hand"
  },
  "location": {
    "id": "uuid",
    "name": "Head Level"
  },
  "movementComponent": {
    "id": "uuid",
    "name": "Wave Motion"
  }
}
```

#### POST /sign
Create a new sign (requires TEACHER or ADMIN role).

**Content-Type:** `multipart/form-data`

**Form Data:**
- `name` (string): Sign name
- `categoryId` (UUID): Category ID
- `type` (enum): Sign type
- `translations` (array): Translations array
- `explanation` (string): Sign explanation
- `languageLevel` (enum): Difficulty level
- `region` (enum): Regional variant
- `handShapeId` (UUID): Hand shape component
- `locationId` (UUID): Location component
- `movementId` (UUID): Movement component
- `video` (file): Video file

#### PUT /sign/{id}
Update existing sign (requires TEACHER or ADMIN role).

#### DELETE /sign/{id}
Delete sign (requires TEACHER or ADMIN role).

#### GET /sign/by-category/{categoryId}
Get signs by category.

#### GET /sign/by-private-collection/{collectionId}
Get signs in a private collection.

### Category Management

#### GET /category
Get all categories.

#### GET /category/{id}
Get category details.

#### POST /category
Create new category (requires TEACHER or ADMIN role).

#### PUT /category/{id}
Update category (requires TEACHER or ADMIN role).

#### DELETE /category/{id}
Delete category (requires TEACHER or ADMIN role).

### User Management

#### GET /user
Get all users (requires ADMIN role).

#### GET /user/{id}
Get user details.

#### POST /user
Create new user (requires ADMIN role).

#### PUT /user/{id}
Update user (requires ADMIN role).

#### DELETE /user/{id}
Delete user (requires ADMIN role).

### File Management

#### POST /files/upload
Upload video file.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file` (file): Video file

**Response:**
```json
{
  "filename": "uploaded_video_123.mp4",
  "originalFilename": "sign_video.mp4",
  "size": 1024000
}
```

#### GET /files/videos/{filename}
Stream video file.

**Response:** Video stream with appropriate headers for web playback.

## Error Handling

The API uses standard HTTP status codes and returns error responses in JSON format:

```json
{
  "error": "Validation failed",
  "message": "Sign name is required",
  "status": 400,
  "timestamp": "2023-12-07T10:30:00Z"
}
```

### Common Status Codes

- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict (e.g., duplicate email)
- `500 Internal Server Error`: Server error

## Rate Limiting

API requests are not currently rate-limited, but this may be implemented in future versions.

## Performance Optimizations

### Database Indexes
The API uses optimized database indexes for:
- Full-text search on translations
- Component-based filtering
- Category and type filtering
- User authentication queries

### Caching
- Search results are optimized with database-level caching
- Static file serving is handled efficiently
- Materialized views for frequently accessed statistics

### Pagination
All list endpoints support pagination to handle large datasets efficiently:
- Default page size: 20 items
- Maximum page size: 100 items
- Use `page` and `size` parameters

## SDK Examples

### JavaScript/TypeScript
```javascript
// Search for signs
const searchSigns = async (query, filters = {}) => {
  const params = new URLSearchParams({
    query,
    page: '0',
    size: '12',
    ...filters
  });

  const response = await fetch(`/api/search/signs?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  return response.json();
};

// Upload video
const uploadVideo = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/files/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  return response.json();
};
```

### cURL Examples

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Search signs
curl -G http://localhost:8080/api/search/signs \
  -H "Authorization: Bearer $TOKEN" \
  -d "query=hello" \
  -d "signType=BASIC" \
  -d "page=0" \
  -d "size=10"

# Upload video
curl -X POST http://localhost:8080/api/files/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@sign_video.mp4"
```

## Future Enhancements

### Planned Features
- Real-time search suggestions via WebSocket
- Advanced AI-powered movement pattern recognition
- Multi-language support for international sign languages
- Video thumbnails and preview generation
- Advanced analytics and learning progress tracking

### API Versioning
Future API versions will be supported through URL versioning:
- `/api/v1/` - Current version
- `/api/v2/` - Future version with enhanced features

## Support

For API support and questions:
- Check the application logs for detailed error information
- Ensure proper authentication headers are included
- Verify request payload format matches the documentation
- Test with smaller datasets when debugging performance issues