# Pagination Implementation

This document describes the pagination implementation for the Project Type module API endpoints.

## Supported Endpoints

### Project Types
- `GET /api/project-types` - Get all project types with pagination

### Report Templates
- `GET /api/report-templates` - Get all report templates with pagination
- `GET /api/report-templates?projectTypeId=:id` - Get templates filtered by project type with pagination

## Query Parameters

All paginated endpoints support the following query parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number (1-based) |
| `pageSize` | number | 10 | Number of items per page |

## Example Requests

### Get Project Types (Page 1, 10 items)
```
GET /api/project-types?page=1&pageSize=10
```

### Get Project Types (Page 2, 5 items)
```
GET /api/project-types?page=2&pageSize=5
```

### Get Report Templates for Specific Project Type
```
GET /api/report-templates?projectTypeId=123e4567-e89b-12d3-a456-426614174000&page=1&pageSize=20
```

## Response Format

All paginated responses follow the structured response format:

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Data retrieved successfully",
  "payload": [
    // Array of items for current page
  ],
  "total": 25,        // Total number of items across all pages
  "totalPages": 3     // Total number of pages
}
```

## Example Response

```json
{
  "status": true,
  "statusCode": 200,
  "message": "Project types retrieved successfully",
  "payload": [
    {
      "id": "uuid-1",
      "name": "Web Development",
      "description": "Web application projects",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "reports": []
    },
    {
      "id": "uuid-2", 
      "name": "Mobile Development",
      "description": "Mobile application projects",
      "createdAt": "2024-01-02T00:00:00Z",
      "updatedAt": "2024-01-02T00:00:00Z",
      "reports": []
    }
  ],
  "total": 25,
  "totalPages": 3
}
```

## Implementation Details

### Service Layer
- Uses TypeORM's `findAndCount()` method for efficient pagination
- Calculates `totalPages` using `Math.ceil(total / pageSize)`
- Maintains consistent ordering by `createdAt DESC`

### Controller Layer
- Accepts `QueryParams` DTO for type safety
- Provides default values (page=1, pageSize=10)
- Returns structured response with pagination metadata

### Database Queries
- Uses `skip` and `take` for efficient database pagination
- Includes relations (projectType, reports) in paginated queries
- Maintains performance with proper indexing on `createdAt`

## Performance Considerations

1. **Database Indexing**: Ensure `createdAt` column is indexed for optimal performance
2. **Page Size Limits**: Consider implementing maximum page size limits (e.g., 100 items)
3. **Caching**: For frequently accessed data, consider implementing caching strategies
4. **Count Optimization**: For very large datasets, consider using approximate counts

## Error Handling

- Invalid page numbers (e.g., page=0) will return the first page
- Invalid page sizes will use the default page size
- Non-existent project type IDs will return empty results with total=0
