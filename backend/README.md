# Room Reservation API

A RESTful API built with Express.js and TypeScript for managing room reservations, including buildings (blocos), rooms (salas), equipment (equipamentos), users (usuarios), and reservations (reservas).

## Features

- 🏢 **Blocos Management**: Manage building blocks
- 🚪 **Salas Management**: Manage rooms with capacity and equipment
- 🖥️ **Equipamentos Management**: Track equipment inventory
- 👥 **Usuarios Management**: User authentication and profiles
- 📅 **Reservas Management**: Room booking system with conflict detection
- 🔒 **Password Hashing**: Secure password storage with bcrypt
- 🔍 **Relationship Queries**: Join queries for detailed information
- 📚 **Swagger Documentation**: Interactive API documentation at `/api-docs`

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Security**: bcrypt for password hashing
- **CORS**: Enabled for cross-origin requests

## Database Schema

### Tables

1. **blocos** - Building blocks

   - bloco_id (PK)
   - nome
   - descricao
   - andar

2. **equipamentos** - Equipment inventory

   - equipamento_id (PK)
   - nome
   - descricao
   - quantidade

3. **salas** - Rooms

   - sala_id (PK)
   - nome
   - descricao
   - capacidade
   - bloco_id (FK)

4. **sala_equipamento** - Many-to-many relationship

   - sala_id (FK)
   - equipamento_id (FK)

5. **usuarios** - Users

   - usuario_id (PK)
   - nome
   - email (unique)
   - senha (hashed)
   - data_criacao
   - data_atualizacao

6. **reservas** - Reservations
   - reserva_id (PK)
   - status
   - data_reserva
   - hora_inicio
   - hora_fim
   - usuario_id (FK)
   - sala_id (FK)

## Installation

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Setup Steps

1. **Clone or extract the project**

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp .env.example .env
```

Edit `.env` file with your database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=room_reservation
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3000
NODE_ENV=development
```

4. **Create the database**

```bash
psql -U postgres
CREATE DATABASE room_reservation;
\q
```

5. **Setup database tables and sample data**

```bash
npm run db:setup
```

6. **Start the development server**

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Interactive Documentation

**Visit the Swagger UI for interactive API documentation:**

```
http://localhost:3000/api-docs
```

The Swagger documentation provides:

- Complete API reference with all endpoints
- Interactive "Try it out" functionality
- Request/response examples
- Schema definitions
- Real-time testing capabilities

### Base URL

```
http://localhost:3000/api
```

### Blocos (Buildings)

#### Get all blocos

```http
GET /api/blocos
```

#### Get bloco by ID

```http
GET /api/blocos/:id
```

#### Create bloco

```http
POST /api/blocos
Content-Type: application/json

{
  "nome": "Bloco D",
  "descricao": "Novo bloco",
  "andar": "3º Andar"
}
```

#### Update bloco

```http
PUT /api/blocos/:id
Content-Type: application/json

{
  "nome": "Bloco D Atualizado",
  "descricao": "Descrição atualizada",
  "andar": "3º Andar"
}
```

#### Delete bloco

```http
DELETE /api/blocos/:id
```

---

### Salas (Rooms)

#### Get all salas (with bloco info)

```http
GET /api/salas
```

#### Get sala by ID (with bloco and equipamentos)

```http
GET /api/salas/:id
```

#### Create sala

```http
POST /api/salas
Content-Type: application/json

{
  "nome": "Sala 301",
  "descricao": "Sala de conferência",
  "capacidade": 50,
  "bloco_id": 1
}
```

#### Update sala

```http
PUT /api/salas/:id
Content-Type: application/json

{
  "nome": "Sala 301 Updated",
  "descricao": "Sala de conferência grande",
  "capacidade": 60,
  "bloco_id": 1
}
```

#### Delete sala

```http
DELETE /api/salas/:id
```

#### Add equipment to sala

```http
POST /api/salas/:id/equipamentos
Content-Type: application/json

{
  "equipamento_id": 2
}
```

#### Remove equipment from sala

```http
DELETE /api/salas/:id/equipamentos/:equipamento_id
```

---

### Equipamentos (Equipment)

#### Get all equipamentos

```http
GET /api/equipamentos
```

#### Get equipamento by ID

```http
GET /api/equipamentos/:id
```

#### Create equipamento

```http
POST /api/equipamentos
Content-Type: application/json

{
  "nome": "Notebook",
  "descricao": "Notebook Dell i5",
  "quantidade": 10
}
```

#### Update equipamento

```http
PUT /api/equipamentos/:id
Content-Type: application/json

{
  "nome": "Notebook",
  "descricao": "Notebook Dell i7",
  "quantidade": 15
}
```

#### Delete equipamento

```http
DELETE /api/equipamentos/:id
```

---

### Usuarios (Users)

#### Get all usuarios

```http
GET /api/usuarios
```

_Note: Passwords are never returned_

#### Get usuario by ID

```http
GET /api/usuarios/:id
```

#### Create usuario

```http
POST /api/usuarios
Content-Type: application/json

{
  "nome": "Carlos Mendes",
  "email": "carlos.mendes@email.com",
  "senha": "securePassword123"
}
```

#### Update usuario

```http
PUT /api/usuarios/:id
Content-Type: application/json

{
  "nome": "Carlos Mendes Silva",
  "email": "carlos.silva@email.com",
  "senha": "newPassword456"
}
```

_Note: senha is optional in updates_

#### Delete usuario

```http
DELETE /api/usuarios/:id
```

---

### Reservas (Reservations)

#### Get all reservas (with user, sala, and bloco info)

```http
GET /api/reservas
```

#### Get reserva by ID

```http
GET /api/reservas/:id
```

#### Get reservas by usuario

```http
GET /api/reservas/usuario/:usuario_id
```

#### Get reservas by sala

```http
GET /api/reservas/sala/:sala_id
```

#### Create reserva

```http
POST /api/reservas
Content-Type: application/json

{
  "status": "confirmada",
  "data_reserva": "2025-11-15",
  "hora_inicio": "2025-11-15T09:00:00",
  "hora_fim": "2025-11-15T11:00:00",
  "usuario_id": 1,
  "sala_id": 2
}
```

_Note: The API checks for time conflicts and returns 409 if the slot is already reserved_

#### Update reserva

```http
PUT /api/reservas/:id
Content-Type: application/json

{
  "status": "confirmada",
  "data_reserva": "2025-11-15",
  "hora_inicio": "2025-11-15T10:00:00",
  "hora_fim": "2025-11-15T12:00:00",
  "usuario_id": 1,
  "sala_id": 2
}
```

#### Update only reserva status

```http
PATCH /api/reservas/:id/status
Content-Type: application/json

{
  "status": "cancelada"
}
```

#### Delete reserva

```http
DELETE /api/reservas/:id
```

---

## Common Status Codes

- `200 OK` - Successful GET, PUT, PATCH
- `201 Created` - Successful POST
- `400 Bad Request` - Missing required fields
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate entry or time slot conflict
- `500 Internal Server Error` - Server error

## Example Responses

### Success Response (GET /api/salas/1)

```json
{
  "sala_id": 1,
  "nome": "Sala 101",
  "descricao": "Sala de aula padrão",
  "capacidade": 40,
  "bloco_id": 1,
  "bloco_nome": "Bloco A",
  "equipamentos": [
    {
      "equipamento_id": 1,
      "nome": "Projetor",
      "descricao": "Projetor multimídia Full HD",
      "quantidade": 15
    },
    {
      "equipamento_id": 3,
      "nome": "Ar Condicionado",
      "descricao": "Split 12000 BTUs",
      "quantidade": 20
    }
  ]
}
```

### Error Response

```json
{
  "error": "Sala not found"
}
```

## Testing the API

### Using curl

**Get all salas:**

```bash
curl http://localhost:3000/api/salas
```

**Create a new usuario:**

```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Test User",
    "email": "test@email.com",
    "senha": "password123"
  }'
```

**Create a reservation:**

```bash
curl -X POST http://localhost:3000/api/reservas \
  -H "Content-Type: application/json" \
  -d '{
    "status": "pendente",
    "data_reserva": "2025-11-20",
    "hora_inicio": "2025-11-20T14:00:00",
    "hora_fim": "2025-11-20T16:00:00",
    "usuario_id": 1,
    "sala_id": 1
  }'
```

### Using Postman or Insomnia

Import the following collection or manually create requests for each endpoint listed above.

## Project Structure

```
room-reservation-api/
├── src/
│   ├── config/            # Configuration files
│   │   └── swagger.ts     # Swagger/OpenAPI configuration
│   ├── controllers/       # Request handlers
│   │   ├── blocosController.ts
│   │   ├── salasController.ts
│   │   ├── equipamentosController.ts
│   │   ├── usuariosController.ts
│   │   └── reservasController.ts
│   ├── database/          # Database configuration
│   │   ├── config.ts
│   │   └── setup.ts
│   ├── routes/            # Route definitions (with Swagger annotations)
│   │   ├── blocosRoutes.ts
│   │   ├── salasRoutes.ts
│   │   ├── equipamentosRoutes.ts
│   │   ├── usuariosRoutes.ts
│   │   ├── reservasRoutes.ts
│   │   └── index.ts
│   ├── types/             # TypeScript interfaces
│   │   └── index.ts
│   ├── app.ts             # Express app configuration
│   └── server.ts          # Server entry point
├── .env.example           # Environment variables template
├── package.json
├── tsconfig.json
├── postman-collection.json
└── README.md
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run db:setup` - Setup database tables and insert sample data

## Security Features

- ✅ Password hashing with bcrypt
- ✅ Environment variables for sensitive data
- ✅ SQL injection protection via parameterized queries
- ✅ CORS enabled
- ✅ Input validation

## Documentation

This project includes comprehensive documentation:

- **[SWAGGER_GUIDE.md](SWAGGER_GUIDE.md)** - Learn how to use the interactive API docs
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Understand the system design and architecture
- **README.md** (this file) - Complete API reference

## Additional Resources

- **Postman Collection**: `postman-collection.json` - Import into Postman for easy testing
- **Swagger UI**: Visit `/api-docs` when the server is running for interactive documentation
