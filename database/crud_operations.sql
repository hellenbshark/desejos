-- CRUD Operations for Wishlist System

-- ================ USERS CRUD ================

-- Create User
INSERT INTO users (name, email, password_hash) 
VALUES (?, ?, ?);

-- Create User Profile
INSERT INTO user_profile (user_id, avatar_url, bio, birth_date) 
VALUES (?, ?, ?, ?);

-- Read User
SELECT u.*, up.avatar_url, up.bio, up.birth_date 
FROM users u
LEFT JOIN user_profile up ON u.id = up.user_id
WHERE u.id = ?;

-- Update User
UPDATE users 
SET name = ?, 
    email = ?, 
    password_hash = ?
WHERE id = ?;

-- Update User Profile
UPDATE user_profile 
SET avatar_url = ?, 
    bio = ?, 
    birth_date = ?
WHERE user_id = ?;

-- Delete User (will cascade to profile and wishlist items)
DELETE FROM users WHERE id = ?;

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

-- ================ ITEM SHARING CRUD ================

-- Share Item with User
INSERT INTO item_sharing (user_id, item_id, permission_type, granted_by, expires_at) 
VALUES (?, ?, ?, ?, ?);

-- Read Item Sharing Permissions
SELECT 
    is.*,
    u.name as shared_with_user,
    gb.name as granted_by_user
FROM item_sharing is
JOIN users u ON is.user_id = u.id
JOIN users gb ON is.granted_by = gb.id
WHERE is.item_id = ?;

-- Update Sharing Permission
UPDATE item_sharing 
SET permission_type = ?, 
    expires_at = ?
WHERE user_id = ? AND item_id = ? AND permission_type = ?;

-- Remove Sharing Permission
DELETE FROM item_sharing 
WHERE user_id = ? AND item_id = ? AND permission_type = ?;

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

-- Get Items Shared with User
SELECT 
    wi.*,
    c.name as category_name,
    u.name as owner_name,
    GROUP_CONCAT(is.permission_type) as permissions
FROM item_sharing is
JOIN wishlist_items wi ON is.item_id = wi.id
JOIN categories c ON wi.category_id = c.id
JOIN users u ON wi.user_id = u.id
WHERE is.user_id = ? AND (is.expires_at IS NULL OR is.expires_at > CURRENT_TIMESTAMP)
GROUP BY wi.id;
