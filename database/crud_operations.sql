-- CRUD Operations for Wishlist System

-- ================ WISHLIST ITEMS CRUD ================

-- Create Wishlist Item
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
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);

-- Read Wishlist Item with Related Data
SELECT 
    wi.*,
    c.name as category_name,
    c.icon as category_icon,
    ps.name as status_name,
    u.name as owner_name,
    pb.name as purchased_by_name
FROM wishlist_items wi
JOIN categories c ON wi.category_id = c.id
JOIN purchase_status ps ON wi.purchase_status_id = ps.id
JOIN users u ON wi.user_id = u.id
LEFT JOIN users pb ON wi.purchased_by = pb.id
WHERE wi.id = ?;

-- Read All Wishlist Items for User
SELECT 
    wi.*,
    c.name as category_name,
    c.icon as category_icon,
    ps.name as status_name
FROM wishlist_items wi
JOIN categories c ON wi.category_id = c.id
JOIN purchase_status ps ON wi.purchase_status_id = ps.id
WHERE wi.user_id = ?
ORDER BY wi.created_at DESC;

-- Update Wishlist Item
UPDATE wishlist_items 
SET category_id = ?,
    purchase_status_id = ?,
    title = ?,
    description = ?,
    price = ?,
    priority = ?,
    url = ?,
    image_url = ?
WHERE id = ? AND user_id = ?;

-- Mark Item as Purchased
UPDATE wishlist_items 
SET purchase_status_id = (SELECT id FROM purchase_status WHERE name = 'Comprado'),
    purchase_date = CURRENT_DATE,
    purchase_price = ?,
    purchased_by = ?,
    updated_at = CURRENT_TIMESTAMP
WHERE id = ?;

-- Delete Wishlist Item
DELETE FROM wishlist_items 
WHERE id = ? AND user_id = ?;

-- ================ CATEGORIES CRUD ================

-- Create Category
INSERT INTO categories (name, description, icon) 
VALUES (?, ?, ?);

-- Read Category
SELECT * FROM categories WHERE id = ?;

-- Read All Categories
SELECT * FROM categories ORDER BY name;

-- Update Category
UPDATE categories 
SET name = ?, 
    description = ?, 
    icon = ?
WHERE id = ?;

-- Delete Category (will fail if category is in use)
DELETE FROM categories WHERE id = ?;

-- ================ USEFUL QUERIES ================

-- Get User's Wishlist Summary
SELECT 
    COUNT(*) as total_items,
    SUM(CASE WHEN ps.name = 'Não Comprado' THEN 1 ELSE 0 END) as wanted_items,
    SUM(CASE WHEN ps.name = 'Comprado' THEN 1 ELSE 0 END) as purchased_items,
    SUM(CASE WHEN ps.name = 'Não Comprado' THEN price ELSE 0 END) as total_wanted_price,
    SUM(CASE WHEN ps.name = 'Comprado' THEN purchase_price ELSE 0 END) as total_spent
FROM wishlist_items wi
JOIN purchase_status ps ON wi.purchase_status_id = ps.id
WHERE wi.user_id = ?;

-- ================ ITEM NOTES CRUD ================

-- Create Note
INSERT INTO item_notes (user_id, item_id, note) 
VALUES (?, ?, ?);

-- Read Notes for Item
SELECT 
    n.*,
    u.name as user_name
FROM item_notes n
JOIN users u ON n.user_id = u.id
WHERE n.item_id = ?
ORDER BY n.created_at DESC;

-- Read Notes by User
SELECT 
    n.*,
    wi.title as item_title
FROM item_notes n
JOIN wishlist_items wi ON n.item_id = wi.id
WHERE n.user_id = ?
ORDER BY n.created_at DESC;

-- Update Note
UPDATE item_notes 
SET note = ?
WHERE id = ? AND user_id = ?;

-- Delete Note
DELETE FROM item_notes 
WHERE id = ? AND user_id = ?;
