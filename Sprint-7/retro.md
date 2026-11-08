# Retrospectiva - Sprint 6 (Soberano Distrito Barber)

**Dinámica utilizada:** Estrella de Mar ⭐️
**Objetivo:** Analizar el desempeño del equipo durante la implementación de bases de datos (MySQL/Sequelize) y el carrito de compras, para aplicar mejoras de cara al Sprint 7 (Validaciones).

---

### 1. Comenzar a hacer (Start doing)
* **Planificar el tiempo de depuración (debugging):** Vimos que conectar la base de datos con la vista puede generar errores inesperados (como el problema de los objetos anidados en Sequelize). Debemos contemplar márgenes de tiempo específicos solo para probar el flujo de datos.
* **Pruebas de las consultas ORM por separado:** Implementar pequeños scripts o usar la consola para verificar qué formato de datos nos devuelve Sequelize (ej. tablas intermedias) antes de mandarlo directamente al motor de plantillas (EJS).

### 2. Hacer más (Do more)
* **Limpieza de datos en los Controladores:** Asegurarnos de mapear y aplanar la información (usando herramientas como `.get({ plain: true })`) directamente en el controlador, para que a las vistas HTML/EJS solo llegue información limpia y lista para mostrar.
* **Apoyo en equipo ante bloqueos:** Aumentar la comunicación cuando un integrante se estanque en un error técnico específico de rutas o controladores, para resolverlo rápidamente entre todos y no detener el progreso.

### 3. Continuar haciendo (Keep doing)
* **Cuidado del Diseño UI/UX:** Mantener el alto nivel de detalle en el maquetado CSS y la interactividad (como los efectos *hover* de los botones de añadir al carrito) para que la experiencia del usuario siga siendo profesional.
* **Persistencia en la resolución de problemas lógicos:** Seguir analizando a fondo los errores de consola para encontrar la raíz estructural de los problemas en lugar de aplicar parches rápidos.

### 4. Hacer menos (Do less)
* **Lógica compleja en las vistas (Front-end):** Reducir la cantidad de procesamiento de datos o cálculos matemáticos pesados dentro de los archivos `.ejs`. Es mejor que el backend entregue los precios, cantidades y subtotales ya calculados.
* **Dejar integraciones críticas para el final:** Evitar dejar la conexión de tablas complejas (como relaciones de Muchos a Muchos) para los últimos días del sprint, ya que requieren bastantes pruebas.

### 5. Dejar de hacer (Stop doing)
* **Trabajar con suposiciones sobre los datos:** Dejar de asumir la estructura de los objetos que retorna la base de datos sin antes verificarlos con un `console.log()` para evitar errores de propiedades `undefined` en el navegador.
* **Subir código a producción (Git) sin pruebas completas:** Evitar hacer *commits* de características sin haber probado el flujo completo de inicio a fin (ej. desde dar clic en "+" hasta verificar que el carrito hace el *checkout* correctamente).