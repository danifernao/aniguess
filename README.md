# AniGuess

Un sencillo juego desarrollado con React en el que debes adivinar el nombre del anime, manga o novela al que pertenece un personaje. Los datos se obtienen a través de la API de AniList.co.

![Captura de pantalla de la aplicación](/screenshot.png)

## Características

- En el quiz puedes:
  - Usar una pista después de cierto tiempo sin responder una pregunta, la cual elimina una de las opciones.
  - Utilizar atajos de teclado para mejorar la experiencia: responder con el teclado numérico, activar pista con la tecla H y avanzar a la siguiente pregunta con la tecla N.
  - Abrir en AniList la página de la obra o del personaje de la respuesta correcta.
  - Generar una imagen con tus estadísticas para compartir tu progreso.

- En configuración puedes:
  - Elegir el idioma de la interfaz (español o inglés).
  - Decidir si quieres que se te pregunte por el nombre del personaje o la obra a la que pertenece.
  - Elegir si los títulos de las obras se muestran en inglés o en romaji.
  - Elegir si deseas incluir preguntas de personajes de anime, manga o ambos.
  - Activar o desactivar la inclusión de personajes de obras con contenido para adultos.
  - Reiniciar las estadísticas del usuario.

- La aplicación ofrece:
  - Diseño adaptable a distintos dispositivos.
  - Soporte PWA (Progressive Web App).
  - Persistencia de preferencias y estadísticas en el almacenamiento local del navegador.

## Instalación

1. Asegúrate de tener instalados [Node.js](https://nodejs.org/es/download) y npm.
2. Descarga o clona este repositorio y accede a la carpeta del proyecto.
3. Abre la terminal en dicha ubicación y ejecuta lo siguiente para instalar las dependencias:

```
npm install
```

4. Renombra el archivo `.env.example` a `.env`, ábrelo y configura las variables de entorno requeridas.

## Visualización

Ubícate en la raíz del proyecto, abre la terminal en dicha ubicación y ejecuta lo siguiente para iniciar el entorno de desarrollo y visualizarlo en el explorador web:

```
npm run dev
```

## Producción

Ubícate en la raíz del proyecto, abre la terminal en dicha ubicación y ejecuta lo siguiente para generar los archivos destinados a un entorno de producción:

```
npm run build
```

Estos se guardarán en una nueva carpeta llamada `dist`.

## Consideraciones

- En la mayoría de los casos, los registros que no tienen imágenes traen en su reemplazo un archivo llamado _default.jpg_. No obstante, se han encontrado escenarios en los que el archivo viene con un nombre aleatorio, evadiendo la filtración. Por lo anterior, es posible que algunos personajes se presenten sin imágenes.
