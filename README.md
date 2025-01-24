Financial Reports Evaluation
Este proyecto es una prueba técnica para la evaluación de reportes financieros. A continuación, encontrarás las instrucciones para instalar y ejecutar el proyecto en tu entorno local.

Requisitos previos
Antes de comenzar, asegúrate de tener instalado lo siguiente:

Node.js (versión 16 o superior) – Descargar Node.js
npm (se incluye con Node.js) o yarn como gestor de paquetes
Un navegador web moderno
Instrucciones de instalación
Clona el repositorio:

Abre tu terminal y ejecuta:

git clone https://github.com/MarcoAntJ31/financial-reports.git
cd financial-reports-evaluation
Instala las dependencias:

Usando npm:

npm install
O, si prefieres usar yarn:

yarn install
Configura las variables de entorno (opcional):

Cómo ejecutar el proyecto
Modo desarrollo:

Inicia el servidor de desarrollo con el siguiente comando:

npm run dev
Esto abrirá la aplicación en tu navegador (normalmente en http://localhost:5173).

Generar una versión para producción:

Si necesitas crear los archivos optimizados para producción, ejecuta:

npm run build
Los archivos generados estarán en la carpeta dist/.

Vista previa de la build:

Si deseas previsualizar la versión de producción localmente, usa:

npm run preview
Esto abrirá la build generada en tu navegador.|

Estructura del proyecto
El proyecto utiliza las siguientes tecnologías y herramientas:

Vue 3: Framework principal de desarrollo frontend
Vuetify: Framework basado en Material Design para componentes UI
Pinia: Sistema de gestión de estado
Vue Toastification: Para notificaciones rápidas y elegantes
Vite: Herramienta para desarrollo rápido y eficiente
ESLint y Prettier: Configuración para garantizar un código limpio y consistente
Características principales
CRUD completo: Crear, Leer, Actualizar y Eliminar transacciones financieras
Filtrado avanzado: Filtros dinámicos por cliente, categoría, tipo y estado
Exportación de datos: Exporta reportes de transacciones fácilmente
Interfaz moderna y responsiva: Construida con Vuetify y optimizada para cualquier dispositivo