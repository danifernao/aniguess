import { bmvbhash } from "blockhash-core";

// Hash perceptual del placeholder.
const placeholderHash =
  "00000000000000000000000007e007e03ffc3ffc000000000000000000000000";

// Distancia máxima permitida para considerar que una imagen es visualmente similar.
// Mientras más alto, más tolerante; pero aumenta el riesgo de falsos positivos.
const hammingThreshold = 8;

// Tamaño al que se normalizan las imágenes.
const normalizedSize = 64;

// Carga una imagen desde una URL.
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const proxiedUrl = `/.netlify/functions/img-proxy?url=${encodeURIComponent(src)}`;

    const img = new Image();

    img.onload = () => {
      resolve(img);
    };

    img.onerror = (error) => {
      reject(error);
    };

    img.src = proxiedUrl;
  });
};

// Genera un hash perceptual de una imagen.
// Flujo: Carga la imagen, la dibuja en un canvas, la redimensiona y
// genera un hash basado en apariencia visual.
export const generateHash = async (src: string): Promise<string> => {
  const img = await loadImage(src);

  const canvas = document.createElement("canvas");

  const ctx = canvas.getContext("2d");

  if (ctx === null) {
    throw new Error("Failed to get 2D context");
  }

  canvas.width = normalizedSize;
  canvas.height = normalizedSize;

  ctx.drawImage(img, 0, 0, normalizedSize, normalizedSize);

  const imageData = ctx.getImageData(0, 0, normalizedSize, normalizedSize);

  return bmvbhash(imageData, 16);
};

// Calcula la distancia Hamming entre dos hashes.
// Mientras más baja la distancia, más parecidas son las imágenes
export const distanceHamming = (hashA: string, hashB: string): number => {
  if (hashA.length !== hashB.length) {
    throw new Error("Hashes must have the same length");
  }

  let distance = 0;

  for (let i = 0; i < hashA.length; i++) {
    if (hashA[i] !== hashB[i]) {
      distance++;
    }
  }

  return distance;
};

// Detecta si una imagen probablemente es el placeholder de AniList.
export const isPlaceholder = async (imageUrl: string): Promise<boolean> => {
  const imageHash = await generateHash(imageUrl);
  const distance = distanceHamming(imageHash, placeholderHash);
  return distance <= hammingThreshold;
};
