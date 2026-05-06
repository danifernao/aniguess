import type {
  ScoreType,
  SettingsType,
  BackupType,
  ApiResponseType,
  CharacterType,
} from "../types/types";
import { useCallback, useEffect, useState } from "react";
import Question from "./Question";
import Answer from "./Answer";
import Loading from "./Loading";
import Score from "./Score";
import Settings from "./Settings";
import i18n from "../i18n";

function CharacterQuiz() {
  // Número total de personajes registrados en AniList.
  const [totalCharacterCount, setTotalCharacterCount] = useState<number | null>(
    null,
  );

  // Arreglo con los IDs de personajes que no se deben tener en cuenta.
  const [usedCharacterIds, setUsedCharacterIds] = useState<number[]>([]);

  // Arreglo con los personajes elegidos aleatoriamente que generan
  // las obras usadas como opciones de respuesta.
  const [optionCharacters, setOptionCharacters] = useState<CharacterType[]>([]);

  // Objeto con los datos del personaje preguntado.
  const [questionCharacter, setQuestionCharacter] =
    useState<CharacterType | null>(null);

  // Determina si la opción elegida por el jugador ante la pregunta es correcta o no.
  // Es NULL cuando no se ha respondido aún.
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  // Total de opciones a mostrar para la pregunta.
  const answerOptionCount: number = 3;

  // Cuenta el número total de preguntas respondidas y el número de aciertos.
  const [score, setScore] = useState<ScoreType>({
    total: 0,
    correct: 0,
  });

  // Opciones de configuración del juego establecidas por el usuario.
  const [settings, setSettings] = useState<SettingsType>({
    language: i18n.language as "es" | "en",
    mediaType: null,
    mediaNsfw: true,
  });

  // Determina si se encontró un error o no con la gestión de la API.
  const [errorFound, setErrorFound] = useState<boolean>(false);

  // Obtiene un número entero aleatorio entre un rango determinado.
  // Acepta un arreglo de números a no tener en cuenta.
  const getRandomInt = (
    from: number,
    to: number,
    exclude: Set<number> = new Set(),
  ): number => {
    let num: number;

    do {
      num = Math.floor(Math.random() * (to - from + 1)) + from;
    } while (exclude.has(num));

    return num;
  };

  // Realiza las solicitudes HTTP y procesa sus respuestas.
  const fetchAniListData = (
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
        query: query,
        variables: variables,
      }),
    };

    return new Promise((resolve, reject): Promise<ApiResponseType> | void => {
      const fetchData = () => {
        return fetch(url, options)
          .then((response) => {
            // Si se ha excedido el límite de solicitudes,
            // espera un tiempo determinado antes de volver a intentar.
            if (response.status === 429) {
              let delay = 30000;

              const rateLimitReset: string | null =
                response.headers.get("X-RateLimit-Reset");

              if (rateLimitReset) {
                delay = Math.ceil(
                  new Date(parseInt(rateLimitReset) * 1000).getTime() -
                    Date.now(),
                );
              }

              setTimeout(fetchData, delay);
            } else {
              response
                .json()
                .then((json) => (response.ok ? resolve(json) : reject(json)));
            }
          })
          .catch(() => setTimeout(fetchData, 10000));
      };

      fetchData();
    });
  };

  // Obtiene el ID del último personaje registrado en AniList.
  const fetchLastCharacterId = (): Promise<number> => {
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

  // Obtiene personajes aleatorios de AniList.
  const fetchRandomCharacters = useCallback((): void => {
    /* Calcula qué porcentaje del rango total de IDs posibles
     * ya ha sido utilizado como pregunta.
     *
     * Como el total se basa en el ID más alto registrado en AniList
     * y no en la cantidad real de personajes existentes, el rango puede
     * contener huecos por IDs eliminados o no válidos.
     *
     * Para evitar que la generación aleatoria se vuelva progresivamente
     * menos eficiente al aumentar la cantidad de IDs excluidos, el historial
     * se reinicia al alcanzar un umbral determinado.
     */
    const usageRatio = usedCharacterIds.length / totalCharacterCount!;

    // Si ya se ha utilizado al menos el 3 % del rango total de IDs posibles,
    // vacía el historial para permitir reutilizarlos nuevamente.
    if (usageRatio >= 0.03) {
      setUsedCharacterIds([]);
    }

    const randomIds: number[] = [];
    const excludedIds = new Set(usedCharacterIds);

    // Genera 20 IDs únicos de manera aleatoria.
    for (let i = 0; i < 20; i++) {
      const randomId: number = getRandomInt(
        1,
        totalCharacterCount!,
        excludedIds,
      );

      randomIds.push(randomId);
      excludedIds.add(randomId);
    }

    const query = `query($idIn: [Int], $type: MediaType) {
      Page {
        characters(id_in: $idIn) {
          id
          name {
            full
          }
          image {
            large
          }
          media(type: $type) {
            nodes {
              id
              isAdult
              title {
                english
                romaji
              }
              siteUrl
            }
          }
          siteUrl
        }
      }
    }`;

    const variables = {
      idIn: randomIds,
      type: settings.mediaType,
    };

    fetchAniListData(query, variables)
      .then((response) => {
        const apiCharacters: CharacterType[] = response.data.Page.characters;
        const filteredCharacters: CharacterType[] = [];

        for (let i = 0; i < apiCharacters.length; i++) {
          // Solo se consideran los personajes que tengan al menos una obra
          // asociada a este, ya que de lo contrario no se podrían generar
          // opciones de respuesta.
          if (apiCharacters[i].media.nodes.length > 0) {
            // Verifica si la imagen del personaje es la predeterminada o no.
            const imageIsDefault = /default\.jpg$/.test(
              apiCharacters[i].image.large,
            );

            // Filtra las obras del personaje para conservar solo aquellas que
            // tengan título disponible (en inglés o romaji) y que cumplan con
            // la configuración de contenido NSFW establecida por el usuario.
            const media = apiCharacters[i].media.nodes.filter(
              (m) =>
                (m.title.english !== "" || m.title.romaji !== "") &&
                (settings.mediaNsfw || !m.isAdult),
            );

            // Si la imagen del personaje no es la predeterminada y tiene
            // al menos una obra que cumpla con los criterios de filtrado,
            // se guarda su información.
            if (!imageIsDefault && media.length > 0) {
              apiCharacters[i].media.nodes = media;
              filteredCharacters.push(apiCharacters[i]);
            }

            // Si se han obtenido ya el número de opciones necesarias,
            // se detiene el ciclo.
            if (
              filteredCharacters.length + optionCharacters.length ===
              answerOptionCount
            ) {
              break;
            }
          }
        }

        setOptionCharacters((c) => [...c, ...filteredCharacters]);
      })
      .catch(() => setErrorFound(true));
  }, [
    usedCharacterIds,
    totalCharacterCount,
    settings.mediaType,
    settings.mediaNsfw,
    optionCharacters.length,
    answerOptionCount,
  ]);

  /* Verifica si la opción elegida por el jugador es correcta y actualiza
   * el puntaje de la partida.
   *
   * La respuesta es correcta si el personaje seleccionado es el mismo
   * que el preguntado o si la obra que representa la opción elegida
   * coincide con alguna de las obras del personaje preguntado.
   */
  const checkAnswer = (selectedOptionCharacter: CharacterType): void => {
    const isCorrect: boolean =
      selectedOptionCharacter.id === questionCharacter!.id ||
      questionCharacter!.media.nodes.some(
        (m) => m.id === selectedOptionCharacter.media.nodes[0].id,
      );

    setIsAnswerCorrect(isCorrect);

    setScore((s) => ({
      total: s.total + 1,
      correct: isCorrect ? s.correct + 1 : s.correct,
    }));
  };

  // Reinicia las variables estado de los personajes y de la respuesta.
  const playAgain = (): void => {
    setOptionCharacters([]);
    setQuestionCharacter(null);
    setIsAnswerCorrect(null);
  };

  // Guarda los datos de la aplicación en el almacenamiento local del navegador.
  const saveToLocal = useCallback(() => {
    if (!totalCharacterCount) {
      return;
    }

    const appData: BackupType = {
      totalCharacterCount,
      usedCharacterIds,
      score,
      settings,
    };

    localStorage.setItem("data", JSON.stringify(appData));
  }, [totalCharacterCount, usedCharacterIds, score, settings]);

  // Guarda las opciones de configuración del juego establecidas por el usuario.
  const saveSettings = (
    key: keyof SettingsType,
    value: string,
    restart: boolean = true,
  ): void => {
    setSettings((s) => ({
      ...s,
      [key]:
        key === "mediaType"
          ? value === "NULL"
            ? null
            : value
          : key === "mediaNsfw"
            ? value === "true"
            : value,
    }));

    if (key === "language") {
      i18n.changeLanguage(value);
    }

    if (restart) {
      playAgain();
    }
  };

  // Reinicia el puntaje.
  const resetScore = () => {
    setScore({
      total: 0,
      correct: 0,
    });
  };

  // Lógica que se ejecuta al cargar el componente por primera vez.
  useEffect(() => {
    const localData: string | null = localStorage.getItem("data");

    // Si existe una copia de respaldo local, se recupera la información y
    // se actualizan las variables estado correspondientes.
    if (localData) {
      const appData = JSON.parse(localData);

      // Si la copia de respaldo corresponde a un esquema antiguo,
      // se migran los datos al nuevo formato.
      const hasOldSchema =
        appData.totalChars !== undefined || appData.idsTaken !== undefined;

      if (hasOldSchema) {
        appData.totalCharacterCount = appData.totalChars;
        appData.usedCharacterIds = appData.idsTaken;

        localStorage.setItem("data", JSON.stringify(appData));
      }

      setUsedCharacterIds(appData.usedCharacterIds);
      setScore(appData.score);
      setSettings(appData.settings);
    }

    // Obtiene el ID más alto de personajes registrado en AniList y lo toma
    // como el rango máximo al momento de generar personajes aleatorios.
    fetchLastCharacterId().then((id) => {
      if (id) {
        setTotalCharacterCount(id);
      } else {
        setErrorFound(true);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cada vez que se el arreglo de personajes, se verifica si es necesario
  // obtener más personajes.
  useEffect(() => {
    if (totalCharacterCount && optionCharacters.length < answerOptionCount) {
      fetchRandomCharacters();
    }
  }, [totalCharacterCount, optionCharacters, fetchRandomCharacters]);

  // Cada vez que se actualice el arreglo de personajes, se verifica si
  // se han obtenido ya el número de opciones necesarias para la pregunta. En tal
  // caso, se elige aleatoriamente un personaje para preguntar y se guarda su ID
  // en el arreglo de IDs tomados.
  useEffect(() => {
    if (optionCharacters.length === answerOptionCount) {
      const rndIndex: number = getRandomInt(0, answerOptionCount - 1);
      setQuestionCharacter(optionCharacters[rndIndex]);
      setUsedCharacterIds((i) => [...i, optionCharacters[rndIndex].id]);
    }
  }, [optionCharacters]);

  // Guarda en el almacenamiento local del navegador la información de la
  // aplicación cada vez que se actualice alguno de los valores.
  useEffect(() => {
    saveToLocal();
  }, [totalCharacterCount, usedCharacterIds, score, settings, saveToLocal]);

  return (
    <div className="main">
      {!errorFound && questionCharacter && isAnswerCorrect === null && (
        <Question
          optionCharacters={optionCharacters}
          questionCharacter={questionCharacter}
          checkAnswer={checkAnswer}
        />
      )}

      {!errorFound && questionCharacter && isAnswerCorrect !== null && (
        <Answer
          questionCharacter={questionCharacter}
          isCorrect={isAnswerCorrect}
          playAgain={playAgain}
        />
      )}

      {(!questionCharacter || errorFound) && (
        <Loading errorFound={errorFound} />
      )}

      <Score score={score} />

      <Settings
        settings={settings}
        saveSettings={saveSettings}
        score={score}
        resetScore={resetScore}
      />
    </div>
  );
}

export default CharacterQuiz;
