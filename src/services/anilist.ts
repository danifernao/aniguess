import { ApiResponseType } from "../types/types";

// Consulta la API de AniList y procesa sus respuestas.
export const fetchAniListData = async (
  query: string,
  variables = {},
): Promise<ApiResponseType> => {
  const url = "https://graphql.anilist.co";

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  };

  while (true) {
    try {
      const response = await fetch(url, options);

      // Si se ha excedido el límite de solicitudes,
      // espera un tiempo determinado antes de volver a intentar.
      if (response.status === 429) {
        let delay = 30000;

        const rateLimitReset = response.headers.get("X-RateLimit-Reset");

        if (rateLimitReset) {
          delay = Math.ceil(
            new Date(parseInt(rateLimitReset) * 1000).getTime() -
              Date.now(),
          );
        }

        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      const json = await response.json();

      if (response.ok) {
        return json;
      }

      throw json;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(error);
      }
      
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  }
};

// Obtiene el ID del último personaje registrado en AniList.
export const fetchLastCharacterId = async (): Promise<number> => {
  const query = `
    query {
      Page(perPage: 1) {
        characters(sort: ID_DESC) {
          id
        }
      }
    }`;

  return fetchAniListData(query)
    .then((response) => response.data.Page.characters[0].id || 0)
    .catch(() => 0);
};