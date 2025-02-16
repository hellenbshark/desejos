-- Criação da tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Criação da tabela de perfil do usuário (relação 1:1 com users)
CREATE TABLE IF NOT EXISTS user_profile (
    user_id INT PRIMARY KEY,
    avatar_url VARCHAR(1000),
    bio TEXT,
    birth_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT one_profile_per_user UNIQUE (user_id)
);

-- Criação da tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_category_name UNIQUE (name)
);

-- Criação da tabela de status de compra
CREATE TABLE IF NOT EXISTS purchase_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_status_name UNIQUE (name)
);

-- Criação da tabela de itens da wishlist
CREATE TABLE IF NOT EXISTS wishlist_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    purchase_status_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    purchase_date DATE,
    purchase_price DECIMAL(10, 2),
    purchased_by INT,
    url VARCHAR(1000),
    image_url VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (purchase_status_id) REFERENCES purchase_status(id) ON DELETE RESTRICT,
    FOREIGN KEY (purchased_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Criação da tabela de compartilhamento de itens (relação ternária entre users, items e permission_types)
CREATE TABLE IF NOT EXISTS item_sharing (
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    permission_type ENUM('view', 'edit', 'reserve', 'buy') NOT NULL,
    granted_by INT NOT NULL,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    PRIMARY KEY (user_id, item_id, permission_type),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES wishlist_items(id) ON DELETE CASCADE,
    FOREIGN KEY (granted_by) REFERENCES users(id) ON DELETE CASCADE
);

-- indices para otimização de consultas
DROP INDEX IF EXISTS idx_email ON users;
DROP INDEX IF EXISTS idx_wishlist_user ON wishlist_items;
DROP INDEX IF EXISTS idx_wishlist_category ON wishlist_items;
DROP INDEX IF EXISTS idx_wishlist_status ON wishlist_items;
DROP INDEX IF EXISTS idx_item_sharing ON item_sharing;

CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_wishlist_user ON wishlist_items(user_id);
CREATE INDEX idx_wishlist_category ON wishlist_items(category_id);
CREATE INDEX idx_wishlist_status ON wishlist_items(purchase_status_id);
CREATE INDEX idx_item_sharing ON item_sharing(user_id, item_id);

-- Inserir categorias padrão
INSERT IGNORE INTO categories (name, description, icon) VALUES 
('Eletrônicos', 'Produtos eletrônicos em geral', 'laptop'),
('Livros', 'Livros e e-books', 'book'),
('Roupas', 'Vestuário em geral', 'shirt'),
('Casa e Decoração', 'Itens para casa', 'home'),
('Jogos', 'Jogos e consoles', 'gamepad'),
('Acessórios', 'Acessórios diversos', 'watch'),
('Outros', 'Outros itens', 'box');

-- Inserir status de compra padrão
INSERT IGNORE INTO purchase_status (name, description) VALUES 
('Não Comprado', 'Item ainda não foi comprado'),
('Comprado', 'Item já foi comprado');
