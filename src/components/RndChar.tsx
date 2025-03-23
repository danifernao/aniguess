import lang from "../assets/lang.json";
import RndCharQuestion from "./RndCharQuestion";
import RndCharAnswer from "./RndCharAnswer";
import RndCharLoading from "./RndCharLoading";
import RndCharScore from "./RndCharScore";
import RndCharSettings from "./RndCharSettings";
import { useEffect, useState } from "react";

interface Media {
  id?: number;
  isAdult?: boolean;
  title: {
    english: string;
    romaji: string;
  };
  siteUrl?: string;
}

interface Char {
  id?: number;
  name?: {
    full: string;
  };
  image?: {
    large: string;
  };
  media?: {
    nodes: Media[];
  };
  siteUrl?: string;
}

interface Response {
  data: {
    Page: {
      characters: Char[];
    };
  };
}

interface Score {
  total: number;
  correct: number;
}

interface Settings {
  mediaType: string | null;
  mediaNsfw: boolean;
}

interface Backup {
  totalChars: number | null;
  idsTaken: number[];
  score: Score;
  settings: Settings;
}

function RndChar() {
  // Número total de personajes registrados en AniList.
  const [totalChars, setTotalChars] = useState<number | null>(null);

  // Arreglo con los IDs de personajes que no se deben tener en cuenta.
  const [idsTaken, setIdsTaken] = useState<number[]>([]);

  // Arreglo con los datos de los personajes tomados aleatoriamente.
  const [chars, setChars] = useState<Char[]>([]);

  // Contendrá el objeto con los datos del personaje preguntado.
  const [currChar, setCurrChar] = useState<Char | null>(null);

  // Determina si la opción elegida por el jugador ante la pregunta es correcta o no.
  // Es NULL cuando no se ha respondido aún.
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Cuenta el número total de preguntas respondidas y el número de aciertos.
  const [score, setScore] = useState<Score>({
    total: 0,
    correct: 0,
  });

  // Opciones para filtrar a los personajes de acuerdo con el tipo y la
  // audiencia de la obra.
  const [settings, setSettings] = useState<Settings>({
    mediaType: null,
    mediaNsfw: true,
  });

  // Objeto que almacenará el contenido textual de la página en el idioma apropiado.
  const [transl, setTransl] = useState<{ [key: string]: any } | null>(null);

  // Determina si se encontró un error o no con la gestión de la API.
  const [errorFound, setErrorFound] = useState<boolean>(false);

  // Total de opciones a mostrar para la pregunta.
  const numOptions: number = 3;

  // Obtiene un número entero aleatorio entre un rango determinado.
  // Acepta un arreglo de números a no tener en cuenta.
  const getRandomInt = (
    from: number,
    to: number,
    exclude: number[] = []
  ): number => {
    let num: number;
    do {
      num = Math.floor(Math.random() * (to - from + 1)) + from;
    } while (exclude?.includes(num));
    return num;
  };

  // Realiza las solicitudes HTTP y procesa sus respuestas.
  const getData = (query: string, variables = {}): Promise<Response> => {
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
    return new Promise((resolve, reject): Promise<Response> | void => {
      const fetchData = () => {
        return fetch(url, options)
          .then((response) => {
            if (response.status === 429) {
              let delay = 30000;
              const rateLimitReset: string | null =
                response.headers.get("X-RateLimit-Reset");
              if (rateLimitReset) {
                delay = Math.ceil(
                  new Date(parseInt(rateLimitReset) * 1000).getTime() -
                    Date.now()
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
  const getLastCharId = (): Promise<number> => {
    const query = `
      query {
        Page(perPage: 1) {
          characters(sort: ID_DESC) {
            id
          }
        }
      }`;
    return getData(query)
      .then((response) => response.data.Page.characters[0].id || 0)
      .catch(() => 0);
  };

  // Obtiene y guarda en la variable de estado "chars" los datos de los personajes
  // elegidos aleatoriamente.
  const getRandomChars = (): void => {
    const rndIds: number[] = [];

    // En tal caso se haya visto todos los personajes, reinicia el arreglo de IDs tomados.
    if (totalChars! < idsTaken.length - 20) {
      setIdsTaken([]);
    }

    // Genera 20 IDs únicos de manera aleatoria.
    for (let i = 0; i < 20; i++) {
      const randomId: number = getRandomInt(1, totalChars!, [
        ...rndIds,
        ...idsTaken,
      ]);
      rndIds.push(randomId);
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
      idIn: rndIds,
      type: settings.mediaType,
    };

    getData(query, variables)
      .then((response) => {
        const data: Char[] = response.data.Page.characters;
        const charsData: Char[] = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].media!.nodes.length > 0) {
            const imageIsDefault = /default\.jpg$/.test(data[i].image!.large);
            const media = data[i].media!.nodes.filter(
              (m) =>
                (m.title.english !== "" || m.title.romaji !== "") &&
                (settings.mediaNsfw || !m.isAdult)
            );
            if (!imageIsDefault && media.length > 0) {
              data[i].media!.nodes = media;
              charsData.push(data[i]);
            }
            if (charsData.length + chars.length === numOptions) {
              break;
            }
          }
        }
        setChars((c) => [...c, ...charsData]);
      })
      .catch(() => setErrorFound(true));
  };

  // Determina si la opción elegida por el jugador es correcta o no
  // e incrementa el número de preguntas respondidas y sus aciertos.
  const checkAnswer = (char: Char): void => {
    const isAnswerCorrect: boolean =
      char.id === currChar!.id ||
      currChar!.media!.nodes.some((m) => m.id === char.media!.nodes[0].id);
    setIsCorrect(isAnswerCorrect);
    setScore((s) => ({
      total: s.total + 1,
      correct: isAnswerCorrect ? s.correct + 1 : s.correct,
    }));
  };

  // Reinicia las variables estado de los personajes y de la respuesta.
  const playAgain = (): void => {
    setChars([]);
    setCurrChar(null);
    setIsCorrect(null);
  };

  // Guarda los datos de la aplicación en el almacenamiento local del navegador.
  const manageLocalData = (action: string): boolean => {
    let backup: Backup;
    if (action === "load") {
      const data: string | null = localStorage.getItem("data");
      if (data) {
        backup = JSON.parse(data);
        setSettings(backup.settings);
        setTotalChars(backup.totalChars);
        setIdsTaken(backup.idsTaken);
        setScore(backup.score);
      } else {
        return false;
      }
    } else {
      backup = {
        totalChars: totalChars,
        idsTaken: idsTaken,
        score: score,
        settings: settings,
      };
      localStorage.setItem("data", JSON.stringify(backup));
    }
    return true;
  };

  // Guarda la configuración de la aplicación.
  const saveSettings = (key: string, value: string): void => {
    if (key === "mediaType") {
      setSettings((s) => ({
        ...s,
        mediaType: value === "NULL" ? null : value,
      }));
    } else {
      setSettings((s) => ({
        ...s,
        mediaNsfw: value === "true" ? true : false,
      }));
    }
    playAgain();
  };

  useEffect(() => {
    const locale: any = new Intl.Locale(navigator.language);
    const language: string = ["en", "es"].includes(locale.language)
      ? locale.language
      : "en";
    const hasBackup = manageLocalData("load");

    if (!hasBackup) {
      getLastCharId().then((id) => {
        if (id) {
          setTotalChars(id);
        } else {
          setErrorFound(true);
        }
      });
    }

    setTransl(lang[language as keyof object]);
    document.title = lang[language as keyof typeof lang].title;
    document.documentElement.lang = language;
  }, []);

  useEffect(() => {
    if (totalChars && chars.length < numOptions) {
      getRandomChars();
    }
  }, [totalChars, chars]);

  useEffect(() => {
    if (chars.length === numOptions) {
      const rndIndex: number = getRandomInt(0, numOptions - 1);
      setCurrChar(chars[rndIndex]);
      setIdsTaken((i) => [...i, chars[rndIndex].id!]);
    }
  }, [chars]);

  useEffect(() => {
    if (totalChars) {
      manageLocalData("save");
    }
  }, [score, settings]);

  return (
    transl && (
      <div className="game">
        {!errorFound && currChar && isCorrect === null && (
          <RndCharQuestion
            chars={chars}
            currChar={currChar}
            checkAnswer={checkAnswer}
            transl={transl.question}
          />
        )}

        {!errorFound && currChar && isCorrect !== null && (
          <RndCharAnswer
            currChar={currChar}
            isCorrect={isCorrect}
            playAgain={playAgain}
            transl={transl.answer}
          />
        )}

        {(!currChar || errorFound) && (
          <RndCharLoading errorFound={errorFound} transl={transl.loading} />
        )}

        <RndCharScore score={score} transl={transl.score} />

        <RndCharSettings
          settings={settings}
          saveSettings={saveSettings}
          transl={transl.settings}
        />
      </div>
    )
  );
}

export default RndChar;
