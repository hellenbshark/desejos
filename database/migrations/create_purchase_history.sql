CREATE TABLE purchase_history (
    id INT NOT NULL AUTO_INCREMENT,
    item_id INT NOT NULL,
    status_id INT NOT NULL,
    user_id INT NOT NULL,
    purchase_price DECIMAL(10,2),
    purchased_by INT,
    purchase_date TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (id),
    FOREIGN KEY (item_id) REFERENCES wishlist_items(id),
    FOREIGN KEY (status_id) REFERENCES purchase_status(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (purchased_by) REFERENCES users(id)
); 