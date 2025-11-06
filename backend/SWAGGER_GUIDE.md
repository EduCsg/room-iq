# Swagger API Documentation Guide

## Accessing the Documentation

Once the server is running, you can access the interactive API documentation at:

```
http://localhost:3000/api-docs
```

## What is Swagger?

Swagger UI provides an interactive interface to explore and test your API endpoints directly from your browser. It automatically generates documentation from the OpenAPI specifications defined in your route files.

## Features Available in Swagger UI

### 1. **View All Endpoints**

- All API endpoints are organized by tags (Blocos, Salas, Equipamentos, Usuarios, Reservas)
- Click on any tag to expand and see all related endpoints
- Each endpoint shows the HTTP method (GET, POST, PUT, PATCH, DELETE) and path

### 2. **Try It Out**

- Click on any endpoint to expand its details
- Click the "Try it out" button
- Fill in the required parameters and request body
- Click "Execute" to send a real request to the API
- View the response in real-time

### 3. **Schema Definitions**

- Scroll down to see the "Schemas" section
- This shows the data models for all entities:
  - Bloco
  - Sala
  - Equipamento
  - Usuario
  - Reserva
  - Error

### 4. **Request Examples**

Each endpoint includes:

- Required parameters
- Request body format (for POST/PUT/PATCH)
- Example values
- Data types and constraints

### 5. **Response Examples**

- HTTP status codes (200, 201, 400, 404, 409, 500)
- Response body format
- Error message formats

## Example: Testing an Endpoint

### Creating a New Bloco

1. Navigate to `http://localhost:3000/api-docs`
2. Find the **Blocos** section
3. Click on `POST /api/blocos`
4. Click "Try it out"
5. Edit the request body:

```json
{
  "nome": "Bloco E",
  "descricao": "New Engineering Building",
  "andar": "Ground Floor"
}
```

6. Click "Execute"
7. View the response:
   - Status: 201 Created
   - Response body with the created bloco including its ID

### Getting All Reservas

1. Find the **Reservas** section
2. Click on `GET /api/reservas`
3. Click "Try it out"
4. Click "Execute"
5. View the complete list of reservas with joined data

## Swagger Configuration

The Swagger configuration is located in:

```
src/config/swagger.ts
```

This file contains:

- API metadata (title, version, description)
- Server URLs
- Tag definitions
- Schema definitions for all data models

## Route Documentation

Each route file includes JSDoc-style Swagger annotations:

```typescript
/**
 * @swagger
 * /api/blocos:
 *   get:
 *     summary: Get all blocos
 *     tags: [Blocos]
 *     responses:
 *       200:
 *         description: List of all blocos
 */
```

These annotations are automatically parsed and displayed in the Swagger UI.

## JSON Specification

You can also access the raw OpenAPI JSON specification at:

```
http://localhost:3000/api-docs.json
```

This can be imported into other API tools like Postman or Insomnia.

## Customization

To customize the Swagger UI appearance or behavior, modify the options in `src/app.ts`:

```typescript
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Room Reservation API Docs",
  })
);
```

## Benefits of Using Swagger

1. **No Postman Required**: Test APIs directly in the browser
2. **Always Up-to-Date**: Documentation updates automatically with code changes
3. **Interactive**: Real-time testing with immediate feedback
4. **Comprehensive**: Shows all endpoints, parameters, and schemas in one place
5. **Team Collaboration**: Share a single URL for API documentation
6. **Client Generation**: Use the OpenAPI spec to generate client libraries

## Tips

- Use the "Authorize" button if you implement authentication later
- The Swagger UI respects your CORS settings
- Responses show actual data from your database
- Failed requests display helpful error messages
- You can download the OpenAPI specification for offline use

Enjoy exploring your API with Swagger! 🚀
