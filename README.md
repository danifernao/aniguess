# AniGuess

Un sencillo juego desarrollado con React en el que debes adivinar el nombre del anime, manga o novela al que pertenece un personaje. Los datos se obtienen a través de la API de AniList.co.

![Captura de pantalla de la aplicación](/screenshot.png)

## Características

- En el quiz puedes:
  - Usar una pista después de cierto tiempo sin responder una pregunta, la cual elimina una de las opciones incorrectas.
  - Utilizar atajos de teclado para mejorar la experiencia: responder con el teclado numérico, activar pista con la tecla **H** y avanzar a la siguiente pregunta con la tecla **N**.
  - Abrir directamente en AniList la página de la obra o del personaje correspondiente a la respuesta correcta.
  - Ver si una obra contiene contenido para adultos antes de visitar su página.
  - Generar una imagen con tus estadísticas para compartir tu progreso.
  - Identificar si una obra tiene contenido para adultos antes de visitar una página.
  - Saltar automáticamente una pregunta si su imagen no es válida.

- En configuración puedes:
  - Elegir el idioma de la interfaz (español o inglés).
  - Decidir si las preguntas son sobre el nombre del personaje o la obra a la que pertenece.
  - Elegir si los títulos de las obras se muestran en inglés o en romaji.
  - Filtrar preguntas por tipo de obra: anime, manga o ambos.
  - Incluir o excluir personajes de obras con contenido para adultos.
  - Reiniciar tus estadísticas.

- La aplicación ofrece:
  - Diseño adaptable a cualquier dispositivo.
  - Soporte PWA para instalarla como aplicación.
  - Preferencias y estadísticas guardadas localmente en el navegador.

## Instalación

1. Asegúrate de tener instalados [Node.js](https://nodejs.org/es/download) y npm.
2. Clona o descarga este repositorio y accede a la carpeta del proyecto.
3. Instala las dependencias:

```
npm install
```

4. Renombra `.env.example` a `.env` y configura las variables de entorno requeridas.
5. (Opcional) Instala Netlify CLI si deseas ejecutar la función que detecta imágenes _placeholder_:

```
npm install -g netlify-cli
```

## Desarrollo

Desde la raíz del proyecto, inicia el entorno de desarrollo:

```
npm run dev
```

O con Netlify CLI para ejecutar las funciones:

```
netlify dev
```

## Producción

Desde la raíz del proyecto, genera los archivos para producción:

```
npm run build
```

El resultado se guardará en la carpeta `dist`.

## Consideraciones

- En la mayoría de los casos, los registros sin imagen traen como reemplazo un archivo llamado `default.jpg`. Sin embargo, se han encontrado casos en los que el _placeholder_ viene con un nombre aleatorio, evadiendo el filtro. Por ello, es posible que algunos personajes aparezcan sin imagen.
