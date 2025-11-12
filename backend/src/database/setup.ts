import pool from "./config";

const setupDatabase = async () => {
  const client = await pool.connect();

  try {
    console.log("Starting database setup...");

    // Drop existing tables in correct order
    await client.query("DROP TABLE IF EXISTS reservas CASCADE");
    await client.query("DROP TABLE IF EXISTS sala_equipamento CASCADE");
    await client.query("DROP TABLE IF EXISTS usuarios CASCADE");
    await client.query("DROP TABLE IF EXISTS salas CASCADE");
    await client.query("DROP TABLE IF EXISTS equipamentos CASCADE");
    await client.query("DROP TABLE IF EXISTS blocos CASCADE");

    // Create blocos table
    await client.query(`
      CREATE TABLE blocos (
        bloco_id SERIAL PRIMARY KEY,
        nome VARCHAR(50) NOT NULL,
        descricao VARCHAR(100),
        andar VARCHAR(15)
      )
    `);
    console.log("✓ Table blocos created");

    // Create equipamentos table
    await client.query(`
      CREATE TABLE equipamentos (
        equipamento_id SERIAL PRIMARY KEY,
        nome VARCHAR(50),
        descricao VARCHAR(100),
        quantidade INT DEFAULT 0 NOT NULL
      )
    `);
    console.log("✓ Table equipamentos created");

    // Create salas table
    await client.query(`
      CREATE TABLE salas (
        sala_id SERIAL PRIMARY KEY,
        nome VARCHAR(50) NOT NULL,
        descricao VARCHAR(100),
        capacidade INT DEFAULT 0,
        bloco_id INT,
        CONSTRAINT fk_salas_blocos
          FOREIGN KEY (bloco_id)
          REFERENCES blocos (bloco_id)
          ON DELETE SET NULL
      )
    `);
    await client.query("CREATE INDEX idx_salas_bloco_id ON salas (bloco_id)");
    console.log("✓ Table salas created");

    // Create sala_equipamento table
    await client.query(`
      CREATE TABLE sala_equipamento (
        sala_id INT,
        equipamento_id INT,
        CONSTRAINT fk_sala_equipamento_sala
          FOREIGN KEY (sala_id)
          REFERENCES salas (sala_id)
          ON DELETE CASCADE,
        CONSTRAINT fk_sala_equipamento_equipamento
          FOREIGN KEY (equipamento_id)
          REFERENCES equipamentos (equipamento_id)
          ON DELETE CASCADE
      )
    `);
    await client.query(
      "CREATE INDEX idx_sala_equipamento_sala_id ON sala_equipamento (sala_id)"
    );
    await client.query(
      "CREATE INDEX idx_sala_equipamento_equipamento_id ON sala_equipamento (equipamento_id)"
    );
    console.log("✓ Table sala_equipamento created");

    // Create usuarios table
    await client.query(`
      CREATE TABLE usuarios (
        usuario_id SERIAL PRIMARY KEY,
        nome VARCHAR(50) NOT NULL,
        email VARCHAR(75) NOT NULL UNIQUE,
        senha VARCHAR(100) NOT NULL,
        data_criacao TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
        data_atualizacao TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log("✓ Table usuarios created");

    // Create reservas table
    await client.query(`
      CREATE TABLE reservas (
        reserva_id SERIAL PRIMARY KEY,
        status VARCHAR(25) NOT NULL,
        data_reserva TIMESTAMPTZ NOT NULL,
        hora_inicio TIMESTAMPTZ NOT NULL,
        hora_fim TIMESTAMPTZ,
        usuario_id INT,
        sala_id INT,
        CONSTRAINT fk_reservas_usuario
          FOREIGN KEY (usuario_id)
          REFERENCES usuarios (usuario_id)
          ON DELETE SET NULL,
        CONSTRAINT fk_reservas_sala
          FOREIGN KEY (sala_id)
          REFERENCES salas (sala_id)
          ON DELETE SET NULL
      )
    `);
    await client.query(
      "CREATE INDEX idx_reservas_usuario_id ON reservas (usuario_id)"
    );
    await client.query(
      "CREATE INDEX idx_reservas_sala_id ON reservas (sala_id)"
    );
    console.log("✓ Table reservas created");

    // Insert sample data
    await insertSampleData(client);

    console.log("\n✅ Database setup completed successfully!");
  } catch (error) {
    console.error("❌ Error setting up database:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

const insertSampleData = async (client: any) => {
  console.log("\nInserting sample data...");

  // Insert blocos
  await client.query(`
    INSERT INTO blocos (nome, descricao, andar) VALUES
    ('Bloco A', 'Bloco principal - Administrativo', 'Térreo'),
    ('Bloco B', 'Bloco de salas de aula', '1º Andar'),
    ('Bloco C', 'Bloco de laboratórios', '2º Andar')
  `);
  console.log("  ✓ Blocos inserted");

  // Insert equipamentos
  await client.query(`
    INSERT INTO equipamentos (nome, descricao, quantidade) VALUES
    ('Projetor', 'Projetor multimídia Full HD', 15),
    ('Computador', 'Desktop i7 16GB RAM', 25),
    ('Ar Condicionado', 'Split 12000 BTUs', 20),
    ('Quadro Branco', 'Quadro branco 2x1m', 30),
    ('Microfone', 'Microfone sem fio', 10)
  `);
  console.log("  ✓ Equipamentos inserted");

  // Insert salas
  await client.query(`
    INSERT INTO salas (nome, descricao, capacidade, bloco_id) VALUES
    ('Sala 101', 'Sala de aula padrão', 40, 1),
    ('Sala 102', 'Sala de aula com projetor', 35, 1),
    ('Lab 201', 'Laboratório de informática', 30, 3),
    ('Auditório', 'Auditório principal', 150, 2),
    ('Sala de Reuniões', 'Sala para reuniões executivas', 12, 1)
  `);
  console.log("  ✓ Salas inserted");

  // Insert sala_equipamento relationships
  await client.query(`
    INSERT INTO sala_equipamento (sala_id, equipamento_id) VALUES
    (1, 1), (1, 3), (1, 4),
    (2, 1), (2, 3), (2, 4),
    (3, 2), (3, 3), (3, 4),
    (4, 1), (4, 3), (4, 5),
    (5, 1), (5, 3), (5, 4)
  `);
  console.log("  ✓ Sala-Equipamento relationships inserted");

  // Insert usuarios (passwords are bcrypt hashed 'password123')
  await client.query(`
    INSERT INTO usuarios (nome, email, senha) VALUES
    ('João Silva', 'joao.silva@email.com', '$2b$10$YourHashedPasswordHere'),
    ('Maria Santos', 'maria.santos@email.com', '$2b$10$YourHashedPasswordHere'),
    ('Pedro Oliveira', 'pedro.oliveira@email.com', '$2b$10$YourHashedPasswordHere')
  `);
  console.log("  ✓ Usuarios inserted");

  // Insert reservas
  await client.query(`
    INSERT INTO reservas (status, data_reserva, hora_inicio, hora_fim, usuario_id, sala_id) VALUES
    ('confirmada', '2025-11-10', '2025-11-10 09:00:00', '2025-11-10 11:00:00', 1, 1),
    ('confirmada', '2025-11-10', '2025-11-10 14:00:00', '2025-11-10 16:00:00', 2, 3),
    ('pendente', '2025-11-11', '2025-11-11 10:00:00', '2025-11-11 12:00:00', 3, 4),
    ('confirmada', '2025-11-12', '2025-11-12 08:00:00', '2025-11-12 10:00:00', 1, 5)
  `);
  console.log("  ✓ Reservas inserted");
};

setupDatabase().catch(console.error);
