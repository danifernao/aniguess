import { useCallback, useEffect, useState } from "react";
import type {
  ScoreType,
  SettingsType,
  CharacterType,
} from "../types/types";

import { getRandomInt, generateUniqueIds } from "../utils/random";
import { fetchAniListData, fetchLastCharacterId } from "../services/anilist";
import { filterValidCharacters } from "../filters/characters";
import i18n from "../i18n";
import { loadGameState, saveGameState } from "../storage/gameState";

export function useCharacterQuiz(answerOptionCount: number) {
  // ID más alto de un personaje registrado en AniList.
  const [maxCharacterId, setMaxCharacterId] = useState<number | null>(null);

  // IDs de personajes que no se deben tener en cuenta.
  const [usedCharacterIds, setUsedCharacterIds] = useState<number[]>([]);

  // Límite de historial de IDs de personajes usados.
  const usedCharactersLimit = 100;

  // Personajes usados como opciones de respuesta.
  const [optionCharacters, setOptionCharacters] = useState<CharacterType[]>([]);

  // Objeto con los datos del personaje preguntado.
  const [questionCharacter, setQuestionCharacter] =
    useState<CharacterType | null>(null);

  // IDs recuperados del almacenamiento local para restaurar la pregunta activa
  // al inicializar la aplicación.
  const [savedOptionCharacterIds, setSavedOptionCharacterIds] = useState<number[] | null>(null);
  const [savedQuestionCharacterId, setSavedQuestionCharacterId] = useState<number | null>(null);

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
    questionMode: "series",
    mediaType: null,
    seriesTitleLanguage: "english",
    mediaNsfw: true,
  });

  // Indica si se encontró un error o no con la gestión de la API.
  const [errorFound, setErrorFound] = useState<boolean>(false);


  // Obtiene personajes desde AniList.
  // Si se proporcionan IDs recuperados del almacenamiento local,
  // estos se utilizan para restaurar la pregunta activa; de lo
  // contrario, se generan IDs aleatorios nuevos.
  const fetchRandomCharacters = useCallback((savedIds: number[] | null = null): void => {
    const excludedIds = new Set(usedCharacterIds);
    const totalIds = answerOptionCount * (settings.mediaNsfw ? 3 : 4);
    const randomIds: number[] = savedIds ?? generateUniqueIds(totalIds, maxCharacterId!, excludedIds);

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


  //  Verifica si la respuesta es correcta y actualiza el puntaje de la partida.
  // 
  // La respuesta es correcta si el personaje seleccionado es el mismo
  // que el preguntado o si la obra que representa la opción elegida
  // coincide con alguna de las obras del personaje preguntado.
  const checkAnswer = (selected: CharacterType): void => {
    const isCorrect =
      selected.id === questionCharacter!.id ||
      (settings.questionMode === "series" &&
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


  // Inicialización.
  useEffect(() => {
    const localState = loadGameState();

    // Se recupera la información guardada localmente y se actualizan las
    // variables estado correspondientes.
    if (localState) {
      setUsedCharacterIds(localState.usedCharacterIds);
      setSavedOptionCharacterIds(localState.optionCharacterIds ?? null);
      setSavedQuestionCharacterId(localState.questionCharacterId ?? null);
      setScore(localState.score);
      setSettings(localState.settings);
    }

    // Obtiene el ID más alto de los personajes registrados en AniList.
    fetchLastCharacterId()
      .then((id) => {
        if (id) {
          setMaxCharacterId(id);
        } else {
          setErrorFound(true);
        }
      });
  }, []);


  // Obtiene más personajes si es necesario.
  // Los IDs recuperados del almacenamiento local solo se reutilizan
  // durante la inicialización para restaurar la pregunta previa.
  useEffect(() => {
    if (maxCharacterId && optionCharacters.length < answerOptionCount) {
      fetchRandomCharacters(savedOptionCharacterIds);

      if (savedOptionCharacterIds) {
        setSavedOptionCharacterIds(null);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxCharacterId, optionCharacters]);


  // Elige aleatoriamente un personaje para preguntar.
  // Si existe un ID recuperado del almacenamiento local,
  // se restaura el personaje previamente preguntado.
  useEffect(() => {
    if (optionCharacters.length === answerOptionCount) {
      let selected;

      if (savedQuestionCharacterId) {
        selected = optionCharacters.find(
          (character) => character.id === savedQuestionCharacterId
        );

        setSavedQuestionCharacterId(null);
      }

      if (!selected) {
        const index = getRandomInt(0, answerOptionCount - 1);
        selected = optionCharacters[index];
      }

      setQuestionCharacter(selected);
      setUsedCharacterIds((prev) => [...prev, selected.id].slice(-usedCharactersLimit));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionCharacters]);


  // Guarda en el almacenamiento local del navegador la información del juego.
  // La pregunta activa solo se almacena mientras no haya sido respondida.
  useEffect(() => {
    if (maxCharacterId) {
      saveGameState({
        usedCharacterIds,
        optionCharacterIds:
          isAnswerCorrect === null && optionCharacters.length
          ? optionCharacters.map((c) => c.id)
          : null,
        questionCharacterId:
          isAnswerCorrect === null
          ? questionCharacter?.id ?? null
          : null,
        score,
        settings,
      });
    }
  }, [maxCharacterId, usedCharacterIds, optionCharacters, questionCharacter, isAnswerCorrect, score, settings]);

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