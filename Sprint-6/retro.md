# Retrospectiva Sprint 5 -> Sprint 6
**Proyecto:** Soberano Distrito

Aplicando la dinámica de la "Estrella de Mar", estas son las conclusiones del equipo tras finalizar la implementación de middlewares, sesiones y el carrito de compras:

1. **Comenzar a hacer:**
   - Planificar la estructura y las relaciones de los datos (DER) antes de escribir código.
   - Utilizar ramas separadas en Git (o commits más frecuentes) para aislar las pruebas con la nueva base de datos.
   - Familiarizarnos con la documentación oficial de Sequelize.

2. **Hacer más:**
   - Revisar la consola del navegador y de Node.js apenas ocurre un error de UI (como nos pasó con el "congelamiento" del carrito).
   - Abstraer código repetitivo para mantener las vistas limpias.

3. **Continuar haciendo:**
   - Mantener la separación de responsabilidades (MVC) que ya tenemos estructurada.
   - Cuidar el diseño y la experiencia de usuario (UX/UI); el panel del carrito y los modales quedaron muy profesionales.
   - Probar las validaciones de seguridad simulando ser un usuario "invitado" intentando acceder a rutas protegidas.

4. **Hacer menos:**
   - Mezclar lógicas que compiten por los mismos selectores o clases CSS (como ocurrió con los modales de reservas y el carrito).

5. **Dejar de hacer:**
   - Dejar código "muerto" o comentado de sprints anteriores en los archivos EJS (como las antiguas validaciones `typeof usuario`).
   - Depender de la manipulación de archivos estáticos (JSON) que complican la escalabilidad.