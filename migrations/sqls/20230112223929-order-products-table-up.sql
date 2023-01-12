CREATE TABLE order_products (
    id SERIAL PRIMARY KEY,
    product_id INTEGER references products(id) NOT NULL, 
    order_id INTEGER references orders(id) NOT NULL,
    quantity INTEGER NOT NULL
 
)