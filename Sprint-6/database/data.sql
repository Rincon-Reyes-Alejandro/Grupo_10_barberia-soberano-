USE soberano_distrito;

INSERT INTO roles (name) VALUES ('admin'), ('client');
INSERT INTO categories (name) VALUES ('Afeitado'), ('Cabello'), ('Barba'), ('Herramientas');

INSERT INTO users (name, email, password, phone, image, role_id) 
VALUES ('Admin Soberano', 'admin@soberano.com', '$2a$10$UnHashDePruebaGeneradoPorBcrypt', '3209934019', 'default-user.png', 1);

INSERT INTO products (name, price, description, image, category_id) VALUES 
('Crema de Afeitado N·01', 10.00, 'Espuma densa, deslizamiento suave y aroma a sándalo.', 'crema-afeitado.jpg', 1),
('Navaja Distrito', 32.00, 'Acero inoxidable y mango de madera natural.', 'navaja.jpg', 4),
('Cera Soberana', 19.00, 'Textura flexible, acabado natural y control duradero.', 'cera.jpg', 2);

-- Creación de un Carrito de prueba para el Admin
INSERT INTO carts (total_price, status, user_id) VALUES (42.00, 'activo', 1);

-- Agregando 1 Crema (10€) y 1 Navaja (32€) al carrito creado arriba (cart_id = 1)
INSERT INTO cart_products (quantity, price, cart_id, product_id) VALUES 
(1, 10.00, 1, 1),
(1, 32.00, 1, 2);