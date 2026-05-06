import { useCallback, useEffect, useState } from "react";
import type {
  ScoreType,
  SettingsType,
  CharacterType,
  GameStateType,
} from "../types/types";

import { getRandomInt } from "../utils/randomInt";
import { fetchAniListData, fetchLastCharacterId } from "../services/anilist";
import { generateUniqueIds } from "../utils/randomIds";
import { filterValidCharacters } from "../rules/characters";
import i18n from "../i18n";

export function useCharacterQuiz(answerOptionCount: number) {
  // ID más alto de un personaje registrado en AniList.
  const [maxCharacterId, setMaxCharacterId] = useState<number | null>(null);

  // IDs de personajes que no se deben tener en cuenta.
  const [usedCharacterIds, setUsedCharacterIds] = useState<number[]>([]);

  // Personajes usados como opciones de respuesta.
  const [optionCharacters, setOptionCharacters] = useState<CharacterType[]>([]);

  // Objeto con los datos del personaje preguntado.
  const [questionCharacter, setQuestionCharacter] =
    useState<CharacterType | null>(null);

  // Indica si la respuesta es correcta o no.
  // Es NULL cuando no se ha respondido aún.
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  // Puntaje del jugador.
  const [score, setScore] = useState<ScoreType>({
    total: 0,
    correct: 0,
  });

  // Configuración del juego.
  const [settings, setSettings] = useState<SettingsType>({
    language: i18n.language as "es" | "en",
    questionMode: "work",
    mediaType: null,
    mediaNsfw: true,
  });

  // Indica si se encontró un error o no con la gestión de la API.
  const [errorFound, setErrorFound] = useState<boolean>(false);


  // Obtiene personajes aleatorios.
  const fetchRandomCharacters = useCallback((): void => {
    /* Calcula qué porcentaje del rango total de IDs posibles
     * ya ha sido utilizado como pregunta.
     *
     * Para evitar que la generación aleatoria se vuelva progresivamente
     * menos eficiente al aumentar la cantidad de IDs excluidos, el historial
     * se reinicia al alcanzar un umbral determinado.
     */
    const usageRatio = usedCharacterIds.length / maxCharacterId!;

    // Si ya se ha utilizado al menos el 3 % del rango total de IDs posibles,
    // vacía el historial para permitir reutilizarlos nuevamente.
    if (usageRatio >= 0.03) {
      setUsedCharacterIds([]);
    }

    // Genera 20 IDs únicos de manera aleatoria.
    const excludedIds = new Set(usedCharacterIds);
    const randomIds: number[] = generateUniqueIds(20, maxCharacterId!, excludedIds);

    const query = `query($idIn: [Int], $type: MediaType) {
      Page {
        characters(id_in: $idIn) {
          id
          name { full }
          image { large }
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

    fetchAniListData(query, {
      idIn: randomIds,
      type: settings.mediaType,
    })
      .then((response) => {
        const apiCharacters = response.data.Page.characters;

        const filtered = filterValidCharacters(
          apiCharacters,
          {
            mediaType: settings.mediaType,
            mediaNsfw: settings.mediaNsfw,
          },
          answerOptionCount - optionCharacters.length
        );

        setOptionCharacters((c) => [...c, ...filtered]);
      })
      .catch(() => setErrorFound(true));
  }, [
    maxCharacterId,
    usedCharacterIds,
    settings.mediaType,
    settings.mediaNsfw,
    optionCharacters.length,
    answerOptionCount,
  ]);


  /* Verifica si la respuesta es correcta y actualiza el puntaje de la partida.
   *
   * La respuesta es correcta si el personaje seleccionado es el mismo
   * que el preguntado o si la obra que representa la opción elegida
   * coincide con alguna de las obras del personaje preguntado.
   */
  const checkAnswer = (selected: CharacterType): void => {
    const isCorrect =
      selected.id === questionCharacter!.id ||
      (settings.questionMode === "work" &&
        questionCharacter!.media.nodes.some(
          (m) => m.id === selected.media.nodes[0].id,
        ));

    setIsAnswerCorrect(isCorrect);

    setScore((s) => ({
      total: s.total + 1,
      correct: isCorrect ? s.correct + 1 : s.correct,
    }));
  };


  // Procede con una nueva pregunta.
  const newQuestion = (): void => {
    setOptionCharacters([]);
    setQuestionCharacter(null);
    setIsAnswerCorrect(null);
  };


  // Reinicia el puntaje.
  const resetScore = () => {
    setScore({
      total: 0,
      correct: 0,
    });
  };


  // Guarda las opciones de configuración del juego.
  const saveSettings = (
    key: keyof SettingsType,
    value: string,
    triggerNewQuestion: boolean = true,
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

    if (triggerNewQuestion) {
      newQuestion();
    }
  };


  // Guarda los datos del juego en el almacenamiento local del navegador.
  const saveToLocal = useCallback(() => {
    if (!maxCharacterId) {
      return;
    }

    const gameState: GameStateType = {
      maxCharacterId,
      usedCharacterIds,
      score,
      settings,
    };

    localStorage.setItem("gameState", JSON.stringify(gameState));
  }, [maxCharacterId, usedCharacterIds, score, settings]);


  // Inicialización.
  useEffect(() => {
    const localData: string | null = localStorage.getItem("gameState");

    // Si existe una copia de respaldo local, se recupera la información y
    // se actualizan las variables estado correspondientes.
    if (localData) {
      const gameState = JSON.parse(localData);

      setUsedCharacterIds(gameState.usedCharacterIds);
      setScore(gameState.score);
      setSettings(gameState.settings);
    }

    // Obtiene el ID más alto de los personajes registrados en AniList.
    fetchLastCharacterId().then((id) => {
      if (id) {
        setMaxCharacterId(id);
      } else {
        setErrorFound(true);
      }
    });
  }, []);


  // Obtiene más personajes si es necesario.
  useEffect(() => {
    if (maxCharacterId && optionCharacters.length < answerOptionCount) {
      fetchRandomCharacters();
    }
  }, [maxCharacterId, optionCharacters, answerOptionCount, fetchRandomCharacters]);


  // Elige aleatoriamente un personaje para preguntar.
  useEffect(() => {
    if (optionCharacters.length === answerOptionCount) {
      const index = getRandomInt(0, answerOptionCount - 1);
      const selected = optionCharacters[index];

      setQuestionCharacter(selected);
      setUsedCharacterIds((prev) => [...prev, selected.id]);
    }
  }, [optionCharacters, answerOptionCount]);

  // Guarda en el almacenamiento local del navegador la información del juego.
  useEffect(() => {
    saveToLocal();
  }, [maxCharacterId, usedCharacterIds, score, settings, saveToLocal]);

  return {
    maxCharacterId,
    usedCharacterIds,
    optionCharacters,
    questionCharacter,
    isAnswerCorrect,
    score,
    settings,
    errorFound,
    checkAnswer,
    newQuestion,
    resetScore,
    saveSettings,
  };
}