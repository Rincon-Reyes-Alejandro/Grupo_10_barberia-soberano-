# Retrospectiva / Planificación — Sprint 4: JSON y Métodos HTTP

## 1. Objetivos del Sprint 4
* Implementar almacenamiento y lectura de datos mediante archivos formato JSON (`products.json` y `users.json`)[cite: 8, 9].
* Desarrollar el CRUD completo de productos utilizando las 7 rutas HTTP requeridas (`GET`, `POST`, `PUT`, `DELETE`)[cite: 9].
* Conectar las vistas de EJS con los controladores y los datos persistentes en archivos locales.

## 2. Tareas a realizar (Tablero de trabajo)
* [ ] Crear y estructurar la carpeta `data/` con los archivos JSON.
* [ ] Configurar el controlador de productos para leer y escribir en `products.json` usando el módulo nativo `fs`.
* [ ] Implementar las rutas de detalle (`/products/:id`), creación, edición y borrado con sus respectivos verbos HTTP[cite: 9].