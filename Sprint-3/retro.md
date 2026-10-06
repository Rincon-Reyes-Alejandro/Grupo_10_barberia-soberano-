# Retrospectiva — Sprint 3: Soberano Distrito Barber

Este documento recoge las conclusiones, aprendizajes y puntos de mejora obtenidos al finalizar el desarrollo del **Sprint 3** de la plataforma web de Soberano Distrito Barber.

---

## 1. ¿Qué hicimos bien? (Continuar haciendo)
* **Modularización con EJS y Partials:** Logramos separar exitosamente los componentes repetitivos (`head`, `header`, `footer`) en una carpeta dedicada (`views/partials/`), reduciendo la duplicación de código y facilitando el mantenimiento futuro.
* **Organización de directorios:** Estructuramos de forma limpia las vistas dividiéndolas en carpetas especializadas (`views/products/` y `views/users/`), tal como exigen las buenas prácticas de arquitectura MVC.
* **Consistencia visual:** Mantuvimos la identidad estética, la paleta de colores y la tipografía de los sprints anteriores al implementar los nuevos formularios de administración.

## 2. ¿Qué podríamos mejorar? (Empezar a hacer)
* **Validación de formularios en el cliente:** Implementar validaciones previas con JavaScript en los formularios de creación y edición antes de enviar los datos al servidor.
* **Estandarización de rutas:** Planificar con mayor anticipación la estructura de rutas del servidor para evitar refactorizaciones menores al conectar los controladores.

## 3. ¿Qué hicimos mal o encontramos como impedimento? (Dejar de hacer)
* **Duplicidad de estilos globales:** Al principio hubo pequeños detalles de desalineación al separar las vistas en subcarpetas debido a rutas relativas en los archivos CSS, lo cual se resolvió utilizando rutas absolutas desde la carpeta pública.
* **Ajuste de tiempos:** La migración completa del formato HTML estático al motor de plantillas EJS tomó un poco más de lo previsto al principio, pero se completó con éxito.

---

##  Conclusión General del Sprint 3
El Sprint 3 se completó de manera satisfactoria, alcanzando todos los objetivos planteados: la implementación de **EJS**, el uso de **partials**, la organización modular de vistas (`products` y `users`) y la creación de los formularios para la administración, creación y edición de productos[cite: 8, 10]. El proyecto se encuentra listo y preparado para el siguiente nivel de integración con bases de datos o lógica de almacenamiento en el Back-end.