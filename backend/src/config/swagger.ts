import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Room Reservation API",
      version: "1.0.0",
      description:
        "A comprehensive API for managing room reservations, buildings, equipment, and users",
      contact: {
        name: "API Support",
        email: "support@roomreservation.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    tags: [
      {
        name: "Blocos",
        description: "Building blocks management",
      },
      {
        name: "Salas",
        description: "Rooms management",
      },
      {
        name: "Equipamentos",
        description: "Equipment management",
      },
      {
        name: "Usuarios",
        description: "Users management",
      },
      {
        name: "Reservas",
        description: "Reservations management",
      },
    ],
    components: {
      schemas: {
        Bloco: {
          type: "object",
          required: ["nome"],
          properties: {
            bloco_id: {
              type: "integer",
              description: "Unique identifier",
              example: 1,
            },
            nome: {
              type: "string",
              description: "Block name",
              example: "Bloco A",
            },
            descricao: {
              type: "string",
              description: "Block description",
              example: "Main administrative building",
            },
            andar: {
              type: "string",
              description: "Floor",
              example: "1º Andar",
            },
          },
        },
        Sala: {
          type: "object",
          required: ["nome"],
          properties: {
            sala_id: {
              type: "integer",
              description: "Unique identifier",
              example: 1,
            },
            nome: {
              type: "string",
              description: "Room name",
              example: "Sala 101",
            },
            descricao: {
              type: "string",
              description: "Room description",
              example: "Standard classroom",
            },
            capacidade: {
              type: "integer",
              description: "Room capacity",
              example: 40,
            },
            bloco_id: {
              type: "integer",
              description: "Associated block ID",
              example: 1,
            },
            bloco_nome: {
              type: "string",
              description: "Block name (when joined)",
              example: "Bloco A",
            },
            equipamentos: {
              type: "array",
              description: "List of equipment in the room",
              items: {
                $ref: "#/components/schemas/Equipamento",
              },
            },
          },
        },
        Equipamento: {
          type: "object",
          required: ["quantidade"],
          properties: {
            equipamento_id: {
              type: "integer",
              description: "Unique identifier",
              example: 1,
            },
            nome: {
              type: "string",
              description: "Equipment name",
              example: "Projetor",
            },
            descricao: {
              type: "string",
              description: "Equipment description",
              example: "Full HD multimedia projector",
            },
            quantidade: {
              type: "integer",
              description: "Available quantity",
              example: 15,
            },
          },
        },
        Usuario: {
          type: "object",
          required: ["nome", "email", "senha"],
          properties: {
            usuario_id: {
              type: "integer",
              description: "Unique identifier",
              example: 1,
            },
            nome: {
              type: "string",
              description: "User name",
              example: "João Silva",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email (unique)",
              example: "joao.silva@email.com",
            },
            senha: {
              type: "string",
              format: "password",
              description: "User password (will be hashed)",
              example: "password123",
            },
            data_criacao: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            data_atualizacao: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        Reserva: {
          type: "object",
          required: [
            "status",
            "data_reserva",
            "hora_inicio",
            "usuario_id",
            "sala_id",
          ],
          properties: {
            reserva_id: {
              type: "integer",
              description: "Unique identifier",
              example: 1,
            },
            status: {
              type: "string",
              description: "Reservation status",
              enum: ["pendente", "confirmada", "cancelada"],
              example: "confirmada",
            },
            data_reserva: {
              type: "string",
              format: "date",
              description: "Reservation date",
              example: "2025-11-15",
            },
            hora_inicio: {
              type: "string",
              format: "date-time",
              description: "Start time",
              example: "2025-11-15T09:00:00",
            },
            hora_fim: {
              type: "string",
              format: "date-time",
              description: "End time",
              example: "2025-11-15T11:00:00",
            },
            usuario_id: {
              type: "integer",
              description: "User ID who made the reservation",
              example: 1,
            },
            sala_id: {
              type: "integer",
              description: "Room ID to be reserved",
              example: 1,
            },
            usuario_nome: {
              type: "string",
              description: "User name (when joined)",
              example: "João Silva",
            },
            sala_nome: {
              type: "string",
              description: "Room name (when joined)",
              example: "Sala 101",
            },
            bloco_nome: {
              type: "string",
              description: "Block name (when joined)",
              example: "Bloco A",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error message",
              example: "Resource not found",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
