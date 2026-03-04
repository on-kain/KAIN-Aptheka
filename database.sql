CREATE Database -- 'Name Database'

DROP TABLE IF EXISTS orders, medicines, users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer'
);

CREATE TABLE medicines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) -- 'antibiotics', 'vitamins', 'painkillers', etc
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    medicine_id INTEGER REFERENCES medicines(id),
    delivery_type VARCHAR(20),
    status VARCHAR(20) DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO medicines (name, price, category) VALUES
('Аспирин Экспресс', 250.00, 'painkillers'),
('Амоксициллин Премиум', 890.00, 'antibiotics'),
('Витамин D3 (1000 IU)', 1200.00, 'vitamins'),
('Корвалол Форте', 150.00, 'painkillers');
