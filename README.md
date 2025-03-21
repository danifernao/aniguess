# ¿De dónde es?

Un simple juego en donde tienes que adivinar el nombre de la obra a la que pertence un personaje de alguna animación, novela o cómic registrado en la base de datos de AniList.

![Captura de pantalla de la aplicación](/screenshot.png)

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
