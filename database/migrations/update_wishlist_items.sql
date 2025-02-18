ALTER TABLE wishlist_items
ADD COLUMN purchase_status_id INT NOT NULL DEFAULT 1,
ADD FOREIGN KEY (purchase_status_id) REFERENCES purchase_status(id);

-- Atualizar os itens existentes para terem o status correto
UPDATE wishlist_items 
SET purchase_status_id = CASE 
    WHEN purchased_by IS NOT NULL THEN 2 -- Comprado
    ELSE 1 -- Não Comprado
END; 