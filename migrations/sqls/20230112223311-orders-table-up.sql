CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER references users(id) NOT NULL, 
    completed BOOLEAN NOT NULL
 
)