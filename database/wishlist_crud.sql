-- CRUD Operations for Wishlist Items

-- Verificar/Inserir dados necessários
INSERT IGNORE INTO categories (name, description, icon) VALUES 
('Roupas', 'Vestidos, blusas, calças e saias', 'shorts'),
('Sapatos', 'Sandálias, tênis, botas e saltos', NULL),
('Acessórios', 'Bolsas, joias e bijuterias', 'gem'),
('Beleza', 'Maquiagem, skincare e perfumes', NULL),
('Outros', 'Outros itens desejados', NULL);

INSERT IGNORE INTO purchase_status (name, description) VALUES 
('Não Comprado', 'Item ainda não foi comprado'),
('Comprado', 'Item já foi comprado');

-- CREATE: Inserir um novo item na wishlist
INSERT INTO wishlist_items (
    user_id,
    category_id,
    purchase_status_id,
    title,
    description,
    price,
    priority,
    url,
    image_url
) VALUES (
    1,                                              -- ID do usuário
    (SELECT id FROM categories WHERE name = 'Roupas' LIMIT 1),  -- ID da categoria
    (SELECT id FROM purchase_status WHERE name = 'Não Comprado' LIMIT 1),  -- Status inicial
    'Vestido Floral',                              -- Título do item
    'Vestido floral para primavera',               -- Descrição
    299.99,                                        -- Preço
    'high',                                        -- Prioridade (low, medium, high)
    'https://www.miumiu.com/br/pt/p/marocain-dress/MF5435_15D5_F0089_S_OOO',  -- URL do produto
    'https://www.miumiu.com/content/dam/miumiubkg_products/M/MF5/MF5435/15D5F0089/MF5435_15D5_F0089_S_OOO_SLF.jpg'  -- URL da imagem
);

-- READ: Buscar todos os itens da wishlist
SELECT 
    w.id,
    w.title,
    w.description,
    CONCAT('R$ ', FORMAT(w.price, 2, 'pt_BR')) as price,
    w.priority,
    w.url,
    w.image_url,
    c.name as category_name,
    c.icon as category_icon,
    ps.name as status_name,
    w.created_at,
    w.updated_at
FROM wishlist_items w
JOIN categories c ON w.category_id = c.id
JOIN purchase_status ps ON w.purchase_status_id = ps.id
WHERE w.user_id = 1                               -- ID do usuário
ORDER BY 
    CASE w.priority
        WHEN 'high' THEN 1
        WHEN 'medium' THEN 2
        WHEN 'low' THEN 3
    END,
    w.created_at DESC;

-- UPDATE: Atualizar um item da wishlist
UPDATE wishlist_items 
SET 
    category_id = (SELECT id FROM categories WHERE name = 'Sapatos'),
    title = 'Salto preto',
    description = 'Sandália preta com detalhes dourados',
    price = 189.90,
    priority = 'medium',
    url = 'https://www.ysl.com/pt-br/pr/sandalia-opyum-em-couro-envernizado-808565361.html',
    image_url = 'https://saint-laurent.dam.kering.com/m/10f58d306d8f1565/Medium-5576620NPKK1000_A.jpg?v=2',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 1                                      -- ID do item
AND user_id = 1;                                 -- ID do usuário (segurança)

-- DELETE: Remover um item da wishlist
DELETE FROM wishlist_items 
WHERE id = 1                                      -- ID do item
AND user_id = 1;                                 -- ID do usuário (segurança)
