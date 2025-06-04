-- ========================
-- CRIAÇÃO DAS TABELAS
-- ========================

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  tipo_usuario ENUM('cliente', 'prestador') NOT NULL DEFAULT 'cliente',
  cpf VARCHAR(11),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE servicos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(255) NOT NULL,
  observacao TEXT,
  valor VARCHAR(20),
  local VARCHAR(255),
  urgente BOOLEAN DEFAULT FALSE,
  user_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE servicos_disponiveis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(255) NOT NULL,
  descricao TEXT
);

CREATE TABLE agendamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  prestador_id INT,
  servico VARCHAR(255) NOT NULL,
  data_agendada DATE NOT NULL,
  hora_agendada VARCHAR(10) NOT NULL,
  status VARCHAR(20) DEFAULT 'agendado',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES users(id),
  FOREIGN KEY (prestador_id) REFERENCES users(id)
);

-- ========================
-- INSERTS DE TESTE
-- ========================

-- Usuários: Cliente e Prestador
INSERT INTO users (name, address, phone, email, password, tipo_usuario, cpf)
VALUES
('Maria Cliente', 'Rua A, 123', '(11)90000-0001', 'cliente@email.com', 'senha123', 'cliente', '12345678900'),
('João Prestador', 'Rua B, 456', '(11)90000-0002', 'prestador@email.com', 'senha123', 'prestador', '09876543211');

-- Serviços fixos da plataforma
INSERT INTO servicos_disponiveis (tipo, descricao)
VALUES
('Eletricista', 'Serviço de reparo e manutenção elétrica'),
('Encanador', 'Conserto de vazamentos e instalações hidráulicas'),
('Pintor', 'Pintura residencial e comercial');

-- Serviço personalizado criado por cliente
INSERT INTO servicos (tipo, observacao, valor, local, urgente, user_id)
VALUES
('Montagem de Móveis', 'Montagem de guarda-roupa 6 portas', '150.00', 'Rua A, 123', true, 1);

-- Agendamento de serviço personalizado com prestador
INSERT INTO agendamentos (cliente_id, prestador_id, servico, data_agendada, hora_agendada, status)
VALUES
(1, 2, 'Montagem de Móveis', '2025-06-05', '14:00', 'agendado');

-- Agendamento de serviço fixo ainda sem prestador
INSERT INTO agendamentos (cliente_id, prestador_id, servico, data_agendada, hora_agendada, status)
VALUES
(1, NULL, 'Eletricista', '2025-06-06', '09:00', 'agendado');
