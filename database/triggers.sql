-- Primeiro, remover triggers existentes
DROP TRIGGER IF EXISTS after_category_insert;
DROP TRIGGER IF EXISTS after_category_update;
DROP TRIGGER IF EXISTS before_category_delete;

-- Trigger de inserção
DELIMITER //
CREATE TRIGGER after_category_insert
AFTER INSERT ON categories
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, operation, record_id, old_value, new_value, created_at)
    VALUES ('categories', 'INSERT', NEW.id, NULL, 
        JSON_OBJECT('name', NEW.name, 'description', NEW.description, 'icon', NEW.icon),
        CURRENT_TIMESTAMP);
END//
DELIMITER ;

-- Trigger de atualização
DELIMITER //
CREATE TRIGGER after_category_update
AFTER UPDATE ON categories
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, operation, record_id, old_value, new_value, created_at)
    VALUES ('categories', 'UPDATE', NEW.id,
        JSON_OBJECT('name', OLD.name, 'description', OLD.description, 'icon', OLD.icon),
        JSON_OBJECT('name', NEW.name, 'description', NEW.description, 'icon', NEW.icon),
        CURRENT_TIMESTAMP);
END//
DELIMITER ;

-- Trigger de exclusão
DELIMITER //
CREATE TRIGGER before_category_delete
BEFORE DELETE ON categories
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, operation, record_id, old_value, new_value, created_at)
    VALUES ('categories', 'DELETE', OLD.id,
        JSON_OBJECT('name', OLD.name, 'description', OLD.description, 'icon', OLD.icon),
        NULL,
        CURRENT_TIMESTAMP);
END//
DELIMITER ;

-- Trigger para log de inserção de notas
CREATE TRIGGER after_note_insert
AFTER INSERT ON item_notes
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, operation, record_id, old_value, new_value, created_at)
    VALUES ('item_notes', 'INSERT', NEW.id, NULL, 
        JSON_OBJECT(
            'user_id', NEW.user_id,
            'item_id', NEW.item_id,
            'note', NEW.note
        ),
        CURRENT_TIMESTAMP);
END;

-- Trigger para log de atualização de notas
CREATE TRIGGER after_note_update
AFTER UPDATE ON item_notes
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, operation, record_id, old_value, new_value, created_at)
    VALUES ('item_notes', 'UPDATE', NEW.id,
        JSON_OBJECT(
            'note', OLD.note
        ),
        JSON_OBJECT(
            'note', NEW.note
        ),
        CURRENT_TIMESTAMP);
END;

-- Trigger para log de exclusão de notas
CREATE TRIGGER before_note_delete
BEFORE DELETE ON item_notes
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, operation, record_id, old_value, new_value, created_at)
    VALUES ('item_notes', 'DELETE', OLD.id,
        JSON_OBJECT(
            'user_id', OLD.user_id,
            'item_id', OLD.item_id,
            'note', OLD.note
        ),
        NULL,
        CURRENT_TIMESTAMP);
END;

-- Remover triggers existentes
DROP TRIGGER IF EXISTS before_delete_category;
DROP TRIGGER IF EXISTS before_insert_category;
DROP TRIGGER IF EXISTS before_update_category;

-- Trigger para impedir exclusão de categoria em uso
DELIMITER //
CREATE TRIGGER before_delete_category
BEFORE DELETE ON categories
FOR EACH ROW
BEGIN
    DECLARE item_count INT;
    
    SELECT COUNT(*) INTO item_count 
    FROM wishlist_items 
    WHERE category_id = OLD.id;
    
    IF item_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Esta categoria não pode ser excluída pois está sendo usada em itens da wishlist';
    END IF;
END//
DELIMITER ;

-- Trigger para impedir duplicação de nomes de categorias
DELIMITER //
CREATE TRIGGER before_insert_category
BEFORE INSERT ON categories
FOR EACH ROW
BEGIN
    DECLARE existing INT;
    
    SELECT COUNT(*) INTO existing 
    FROM categories 
    WHERE LOWER(name) = LOWER(NEW.name);
    
    IF existing > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Já existe uma categoria com este nome';
    END IF;
END//
DELIMITER ;

-- Trigger para impedir duplicação de nomes em atualizações
DELIMITER //
CREATE TRIGGER before_update_category
BEFORE UPDATE ON categories
FOR EACH ROW
BEGIN
    DECLARE existing INT;
    
    IF NEW.name != OLD.name THEN
        SELECT COUNT(*) INTO existing 
        FROM categories 
        WHERE LOWER(name) = LOWER(NEW.name);
        
        IF existing > 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Já existe uma categoria com este nome';
        END IF;
    END IF;
END//
DELIMITER ;

-- Triggers para purchase_status
DROP TRIGGER IF EXISTS before_delete_status;
DROP TRIGGER IF EXISTS before_insert_status;
DROP TRIGGER IF EXISTS before_update_status;

-- Trigger para impedir exclusão de status em uso
DELIMITER //
CREATE TRIGGER before_delete_status
BEFORE DELETE ON purchase_status
FOR EACH ROW
BEGIN
    DECLARE item_count INT;
    
    SELECT COUNT(*) INTO item_count 
    FROM wishlist_items 
    WHERE status_id = OLD.id;
    
    IF item_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Este status não pode ser excluído pois está sendo usado em itens da wishlist';
    END IF;
END//
DELIMITER ;

-- Trigger para impedir duplicação de nomes de status
DELIMITER //
CREATE TRIGGER before_insert_status
BEFORE INSERT ON purchase_status
FOR EACH ROW
BEGIN
    DECLARE existing INT;
    
    SELECT COUNT(*) INTO existing 
    FROM purchase_status 
    WHERE LOWER(name) = LOWER(NEW.name);
    
    IF existing > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Já existe um status com este nome';
    END IF;
END//
DELIMITER ;

-- Trigger para impedir duplicação de nomes em atualizações
DELIMITER //
CREATE TRIGGER before_update_status
BEFORE UPDATE ON purchase_status
FOR EACH ROW
BEGIN
    DECLARE existing INT;
    
    IF NEW.name != OLD.name THEN
        SELECT COUNT(*) INTO existing 
        FROM purchase_status 
        WHERE LOWER(name) = LOWER(NEW.name);
        
        IF existing > 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Já existe um status com este nome';
        END IF;
    END IF;
END//
DELIMITER ; 