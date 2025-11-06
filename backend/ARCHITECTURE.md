# Room Reservation API - Architecture Overview

## System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                         CLIENT                               │
│  (Browser, Postman, Mobile App, Frontend Application)        │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 │ HTTP Requests
                 │
┌────────────────▼─────────────────────────────────────────────┐
│                    EXPRESS SERVER                            │
│                   (Port 3000)                                │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │              MIDDLEWARE LAYER                        │    │
│  │  • CORS                                              │    │
│  │  • JSON Parser                                       │    │
│  │  • URL Encoded Parser                                │    │
│  │  • Request Logger                                    │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │           SWAGGER DOCUMENTATION                      │    │
│  │  Route: /api-docs                                    │    │
│  │  • Interactive UI                                    │    │
│  │  • Try-it-out functionality                          │    │
│  │  • Schema definitions                                │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐     │
│  │                  ROUTES                             │     │
│  │                                                     │     │
│  │  /api/blocos          ──────►  Blocos Routes        │     │
│  │  /api/salas           ──────►  Salas Routes         │     │
│  │  /api/equipamentos    ──────►  Equipamentos Routes  │     │
│  │  /api/usuarios        ──────►  Usuarios Routes      │     │
│  │  /api/reservas        ──────►  Reservas Routes      │     │
│  │                                                     │     │
│  └──────────────┬──────────────────────────────────────┘     │
│                 │                                            │
│  ┌──────────────▼───────────────────────────────────────┐    │
│  │              CONTROLLERS                             │    │
│  │  • Request validation                                │    │
│  │  • Business logic                                    │    │
│  │  • Database queries                                  │    │
│  │  • Response formatting                               │    │
│  │  • Error handling                                    │    │
│  └──────────────┬───────────────────────────────────────┘    │
│                 │                                            │
└─────────────────┼────────────────────────────────────────────┘
                  │
                  │ SQL Queries (pg pool)
                  │
┌─────────────────▼────────────────────────────────────────────┐
│                   POSTGRESQL DATABASE                        │
│                                                              │
│  ┌───────────┐  ┌───────────┐   ┌────────────┐               │
│  │  blocos   │  │   salas   │   │equipamentos│               │
│  └─────┬─────┘  └─────┬─────┘   └──────┬─────┘               │
│        │              │                │                     │
│        │              └────────┬───────┘                     │
│        │                       │                             │
│        │              ┌────────▼────────┐                    │
│        │              │sala_equipamento │                    │
│        │              └─────────────────┘                    │
│        │                                                     │
│  ┌─────▼──────┐  ┌──────────┐                                │
│  │  usuarios  │  │ reservas │                                │
│  └────────────┘  └──────────┘                                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Request Flow Example

### Creating a Reserva

```
1. CLIENT sends POST request
   └─► http://localhost:3000/api/reservas
       Body: {
         "status": "pendente",
         "data_reserva": "2025-11-20",
         "hora_inicio": "2025-11-20T14:00:00",
         "hora_fim": "2025-11-20T16:00:00",
         "usuario_id": 1,
         "sala_id": 1
       }

2. EXPRESS SERVER receives request
   └─► Middleware: CORS, JSON parsing, logging

3. ROUTES layer matches path
   └─► /api/reservas → reservasRoutes.ts

4. CONTROLLER processes request
   └─► reservasController.createReserva()
       ├─► Validates required fields
       ├─► Checks for time conflicts
       │   └─► Queries database for overlapping reservations
       └─► If no conflict, inserts new reserva

5. DATABASE executes query
   └─► INSERT INTO reservas (status, data_reserva, ...) VALUES (...)
       └─► Returns newly created record with reserva_id

6. CONTROLLER formats response
   └─► Returns JSON with created reserva

7. CLIENT receives response
   └─► Status: 201 Created
       Body: {
         "reserva_id": 5,
         "status": "pendente",
         "data_reserva": "2025-11-20",
         ...
       }
```

## Component Responsibilities

### Routes (`src/routes/`)

- Define API endpoints
- Map HTTP methods to controller functions
- Include Swagger documentation annotations
- Group related endpoints (e.g., all bloco operations)

### Controllers (`src/controllers/`)

- Handle request/response logic
- Validate input data
- Execute database operations via pg pool
- Format and return responses
- Handle errors gracefully

### Database (`src/database/`)

- **config.ts**: PostgreSQL connection pool
- **setup.ts**: Schema creation and sample data insertion

### Types (`src/types/`)

- TypeScript interfaces for type safety
- Define data models matching database schema

### Config (`src/config/`)

- **swagger.ts**: OpenAPI/Swagger configuration
  - API metadata
  - Schema definitions
  - Server URLs

## Database Relationships

```
blocos (1) ──────< (many) salas
                           │
                           │ (many)
                           │
                     sala_equipamento ──< (many) equipamentos
                           │
                           │ (many)
                           │
usuarios (1) ──────< (many) reservas >────── (many) salas
```

## Technology Stack Details

| Layer         | Technology         | Purpose                    |
| ------------- | ------------------ | -------------------------- |
| Runtime       | Node.js            | JavaScript runtime         |
| Framework     | Express.js         | Web application framework  |
| Language      | TypeScript         | Type-safe JavaScript       |
| Database      | PostgreSQL         | Relational database        |
| DB Client     | pg (node-postgres) | PostgreSQL client          |
| Documentation | Swagger UI         | Interactive API docs       |
| Spec          | OpenAPI 3.0        | API specification standard |
| Security      | bcrypt             | Password hashing           |
| CORS          | cors               | Cross-origin requests      |

## API Endpoints Summary

### Blocos

- `GET /api/blocos` - List all
- `GET /api/blocos/:id` - Get one
- `POST /api/blocos` - Create
- `PUT /api/blocos/:id` - Update
- `DELETE /api/blocos/:id` - Delete

### Salas

- `GET /api/salas` - List all (with bloco info)
- `GET /api/salas/:id` - Get one (with equipamentos)
- `POST /api/salas` - Create
- `PUT /api/salas/:id` - Update
- `DELETE /api/salas/:id` - Delete
- `POST /api/salas/:id/equipamentos` - Add equipment
- `DELETE /api/salas/:id/equipamentos/:equipamento_id` - Remove equipment

### Equipamentos

- `GET /api/equipamentos` - List all
- `GET /api/equipamentos/:id` - Get one
- `POST /api/equipamentos` - Create
- `PUT /api/equipamentos/:id` - Update
- `DELETE /api/equipamentos/:id` - Delete

### Usuarios

- `GET /api/usuarios` - List all (passwords excluded)
- `GET /api/usuarios/:id` - Get one
- `POST /api/usuarios` - Create (password hashed)
- `PUT /api/usuarios/:id` - Update
- `DELETE /api/usuarios/:id` - Delete

### Reservas

- `GET /api/reservas` - List all (with joins)
- `GET /api/reservas/:id` - Get one
- `GET /api/reservas/usuario/:usuario_id` - By user
- `GET /api/reservas/sala/:sala_id` - By room
- `POST /api/reservas` - Create (with conflict check)
- `PUT /api/reservas/:id` - Update
- `PATCH /api/reservas/:id/status` - Update status only
- `DELETE /api/reservas/:id` - Delete

## Key Features

### 1. Type Safety

TypeScript provides compile-time type checking for:

- Request/response objects
- Database query results
- Function parameters and returns

### 2. Security

- Password hashing with bcrypt (10 rounds)
- SQL injection prevention (parameterized queries)
- CORS enabled for cross-origin requests

### 3. Data Integrity

- Foreign key constraints
- Cascade deletes for relationships
- Unique constraints (e.g., usuario email)
- NOT NULL constraints for required fields

### 4. Conflict Detection

Reservas controller checks for:

- Overlapping time slots
- Same sala on same date
- Excludes cancelled reservations from conflicts

### 5. Rich Queries

- JOIN queries return related data
- Salas include bloco name and equipamentos list
- Reservas include usuario and sala names

### 6. Interactive Documentation

- Swagger UI at `/api-docs`
- Try-it-out functionality
- Real-time API testing
- Schema visualization

## Development Workflow

```
1. Edit TypeScript source files in src/
   │
2. ts-node-dev watches for changes
   │
3. Automatically recompiles TypeScript
   │
4. Restarts server with new code
   │
5. Test changes immediately via Swagger UI or Postman
```

## Production Build

```bash
npm run build
   │
   └─► TypeScript Compiler (tsc)
        │
        └─► Generates JavaScript in dist/
             │
             └─► Run with: npm start
```

## Environment Configuration

All configuration via environment variables:

- Database connection details
- Server port
- Node environment (development/production)

This keeps sensitive data out of source code!
