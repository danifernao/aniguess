# AniGuess

Un simple juego elaborado con React en el que se debe adivinar el nombre de la animación, cómic o novela a la que pertenece un personaje. Los datos son proporcionados por AniList.co.

![Captura de pantalla de la aplicación](/screenshot.jpeg)

### Instalación

1. Asegúrate de tener instalado Node.js y NPM.
2. Descarga o clona este repositorio e ingresa a él.
3. Abre el terminal en dicha ubicación y ejecuta lo siguiente para instalar las dependencias:

```
npm install
```

### Visualización

Ubícate en la raíz del proyecto, abre el terminal en dicha ubicación y ejecuta lo siguiente para iniciar el entorno de desarrollo y visualizarlo en el explorador web:

```
npm run dev
```

### Producción

Ubícate en la raíz del proyecto, abre el terminal en dicha ubicación y ejecuta lo siguiente para generar los archivos destinados a un entorno de producción:

```
npm run build
```

Estos se guardarán en una nueva carpeta llamada `dist`.

### Consideraciones

- En la mayoría de los casos, los registros que no tienen imágenes traen en su reemplazo un archivo llamado _default.jpg_. No obstante, se han encontrado escenarios en los que el archivo viene con un nombre aleatorio, evadiendo la filtración. Por lo anterior, es posible que algunos personajes se presenten sin imágenes.
