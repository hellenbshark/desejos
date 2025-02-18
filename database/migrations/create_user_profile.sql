-- Primeiro, remover a tabela se ela existir (para evitar conflitos)
DROP TABLE IF EXISTS user_profile;

-- Criar a tabela user_profile
CREATE TABLE user_profile (
    user_id INT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    preferences JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Inserir perfil inicial para usuários existentes
INSERT INTO user_profile (user_id, bio)
SELECT id, 'Olá, este é meu perfil!'
FROM users u
WHERE NOT EXISTS (
    SELECT 1 FROM user_profile up WHERE up.user_id = u.id
); 