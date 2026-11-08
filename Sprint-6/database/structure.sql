CREATE DATABASE IF NOT EXISTS soberano_distrito;
USE soberano_distrito;

-- Tablas Secundarias
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Tablas Principales
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    image VARCHAR(255) DEFAULT 'default-user.png',
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255) DEFAULT 'default-product.png',
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Tablas del Carrito de Compras (El Reto Completo)
CREATE TABLE carts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    total_price DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'activo',
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE cart_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    cart_id INT,
    product_id INT,
    FOREIGN KEY (cart_id) REFERENCES carts(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);