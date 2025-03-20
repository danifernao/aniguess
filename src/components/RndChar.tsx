import lang from "../assets/lang.json";
import RndCharQuestion from "./RndCharQuestion";
import RndCharAnswer from "./RndCharAnswer";
import RndCharLoading from "./RndCharLoading";
import RndCharScore from "./RndCharScore";
import { useEffect, useState } from "react";

interface Char {
  id?: number;
  name?: {
    full: string;
  };
  image?: {
    large: string;
  };
  media?: {
    nodes: [
      {
        id?: number;
        type?: string;
        title: {
          english: string;
          romaji: string;
        };
        siteUrl?: string;
      }
    ];
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

function RndChar() {
  // Número total de personajes registrados en AniList.
  const [totalChars, setTotalChars] = useState<number>(0);

  // Arreglo con los IDs de personajes que no se deben tener en cuenta.
  const [idsTaken, setIdsTaken] = useState<number[]>([]);

  // Arreglo con los datos de los personajes tomados aleatoriamente.
  const [chars, setChars] = useState<Char[]>([]);

  // Contendrá el objeto con los datos del personaje preguntado.
  const [currChar, setCurrChar] = useState<Char | null>(null);

  /* Determina si la opción elegida por el jugador ante la pregunta es
     correcta (TRUE) o no (FALSE). Es NULL cuando no se ha respondido aún. */
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Cuenta el número total de preguntas respondidas y el número de aciertos.
  const [score, setScore] = useState<Score>({
    total: 0,
    correct: 0,
  });

  // Objeto que almacenará el contenido textual de la página en el idioma apropiado.
  const [transl, setTransl] = useState<{ [key: string]: any } | null>(null);

  // Determina si se encontró un error (TRUE) o no (FALSE).
  const [errorFound, setErrorFound] = useState<boolean>(false);

  // Total de opciones a mostrar para la pregunta.
  const numOptions: number = 3;

  /* Obtiene un número entero aleatorio entre un rango determinado.
     Acepta un arreglo de números a no tener en cuenta. */
  const getRandomInt = (from: number, to: number, exclude: number[] = []) => {
    let num: number;
    do {
      num = Math.floor(Math.random() * (to - from + 1)) + from;
    } while (exclude?.includes(num));
    return num;
  };

  // Realiza las solicitudes HTTP y procesa sus respuestas.
  const getData = (query: string, variables = {}): Promise<Response> => {
    const url: string = "https://graphql.anilist.co";
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
              let delay: number = 30000;
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
    const query: string = `
      query {
        Page(perPage: 1) {
          characters(sort: ID_DESC) {
            id
          }
        }
      }`;
    return getData(query)
      .then((response) => response.data.Page.characters[0].id || 0)
      .catch(() => {
        setErrorFound(true);
        return 0;
      });
  };

  /* Obtiene y guarda en la variable de estado "chars" los datos de los personajes
     elegidos aleatoriamente.  */
  const getRandomChars = (): void => {
    const rndIds: number[] = [];

    // En tal caso se haya visto todos los personajes, reinicia el arreglo de IDs.
    if (totalChars < idsTaken.length - 20) {
      setIdsTaken([]);
    }

    // Genera 20 IDs únicos de manera aleatoria.
    for (let i = 0; i < 20; i++) {
      const randomId: number = getRandomInt(1, totalChars, [
        ...rndIds,
        ...idsTaken,
      ]);
      rndIds.push(randomId);
    }

    const query: string = `query {
      Page {
        characters(id_in: [${rndIds.join(",")}]) {
          id
          name {
            full
          }
          image {
            large
          }
          media {
            nodes {
              id
              type
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

    getData(query)
      .then((response) => {
        const data: Char[] = response.data.Page.characters;
        const charsData: Char[] = [];

        for (let i = 0; i < data.length; i++) {
          if (data[i].media!.nodes.length > 0) {
            const imageIsDefault: boolean = /default\.jpg$/.test(
              data[i].image!.large
            );
            const hasMediaTitle: boolean = !!(
              data[i].media!.nodes[0].title.english !== "" ||
              data[i].media!.nodes[0].title.romaji !== ""
            );
            if (!imageIsDefault && hasMediaTitle) {
              charsData.push(data[i]);
            }

            // Rompe el ciclo si ya se tiene el número apropiado de personajes.
            if (charsData.length + chars.length === numOptions) {
              break;
            }
          }
        }

        setChars((c) => [...c, ...charsData]);
      })
      .catch(() => setErrorFound(true));
  };

  // Determina si la opción elegida por el jugador es correcta o no.
  // Incrementa el número de preguntas respondidas y sus aciertos.
  const checkAnswer = (char: Char): void => {
    const isAnswerCorrect: boolean =
      char.id === currChar!.id ||
      currChar!.media!.nodes.some(
        (m) =>
          m.id === char.media!.nodes[0].id &&
          m.type === char.media!.nodes[0].type
      );

    setIsCorrect(isAnswerCorrect);

    setScore((q) => ({
      total: q.total + 1,
      correct: isAnswerCorrect ? q.correct + 1 : q.correct,
    }));
  };

  // Reinicia las variables estado de los personajes y de la respuesta.
  const playAgain = (): void => {
    setChars([]);
    setCurrChar(null);
    setIsCorrect(null);
  };

  useEffect(() => {
    const storage: string | null = localStorage.getItem("backup");
    const locale: any = new Intl.Locale(navigator.language);
    const language: string = ["en", "es"].includes(locale.language)
      ? locale.language
      : "en";

    /* Verifica si se tienen datos de la aplicación guardados en el navegador.
       En tal caso de que existan, inicia con ellos. */
    if (storage) {
      const backup: {
        totalChars: number;
        idsTaken: number[];
        score: Score;
      } = JSON.parse(storage);
      setTotalChars(backup.totalChars);
      setIdsTaken(backup.idsTaken);
      setScore(backup.score);
    } else {
      getLastCharId().then((id) => setTotalChars(id));
    }

    // Establece el lenguaje de la aplicación.
    setTransl(lang[language as keyof object]);
    document.title = lang[language as keyof typeof lang].title;
    document.documentElement.lang = language;
  }, []);

  useEffect(() => {
    if (totalChars > 0 && chars.length < numOptions) {
      getRandomChars();
    }
  }, [totalChars, chars]);

  useEffect(() => {
    if (chars.length === numOptions) {
      const rndIndex: number = getRandomInt(0, numOptions - 1);
      const backup = {
        totalChars: totalChars,
        idsTaken: idsTaken,
        score: score,
      };

      setCurrChar(chars[rndIndex]);
      setIdsTaken((i) => [...i, chars[rndIndex].id!]);

      localStorage.setItem("backup", JSON.stringify(backup));
    }
  }, [chars]);

  return (
    transl && (
      <div className="character">
        {!errorFound &&
          currChar &&
          chars.length === numOptions &&
          isCorrect === null && (
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

        {(chars.length < numOptions || !currChar || errorFound) && (
          <RndCharLoading errorFound={errorFound} transl={transl.loading} />
        )}

        <RndCharScore score={score} transl={transl.score} />
      </div>
    )
  );
}

export default RndChar;
