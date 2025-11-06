import dotenv from "dotenv";
import app from "./app";
import pool from "./database/config";

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Test database connection
    const client = await pool.connect();
    console.log("✅ Database connection successful");
    client.release();

    // Start server
    app.listen(PORT, () => {
      console.log(`\n🚀 Server is running on port ${PORT}`);
      console.log(`📍 Local: http://localhost:${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`📍 API Base: http://localhost:${PORT}/api`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log("\nAvailable endpoints:");
      console.log(`  - GET    /api/blocos`);
      console.log(`  - GET    /api/salas`);
      console.log(`  - GET    /api/equipamentos`);
      console.log(`  - GET    /api/usuarios`);
      console.log(`  - GET    /api/reservas`);
      console.log("\n⚡ Ready to accept requests\n");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  console.log("\n⚠️  SIGTERM received, closing server gracefully...");
  await pool.end();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("\n⚠️  SIGINT received, closing server gracefully...");
  await pool.end();
  process.exit(0);
});

startServer();
