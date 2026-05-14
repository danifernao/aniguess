import { useCallback, useEffect, useState } from "react";
import type {
  ScoreType,
  SettingsType,
  CharacterType,
  ErrorType,
} from "../types/types";
import { getRandomInt, generateUniqueIds } from "../utils/random";
import { fetchAniListData, fetchLastCharacterId } from "../services/anilist";
import { filterValidCharacters } from "../filters/characters";
import i18n from "../i18n";
import { loadGameState, saveGameState } from "../storage/gameState";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function useCharacterQuiz(answerOptionCount: number) {
  const { t } = useTranslation();

  // Número máximo de IDs guardados en usedCharacterIds.
  const usedCharactersLimit = 100;

  // IDs usados previamente para evitar repetición de personajes.
  const [usedCharacterIds, setUsedCharacterIds] = useState<number[]>([]);

  // Pregunta y respuestas recuperadas del almacenamiento local para restaurar sesión.
  const [savedQuestionCharacterId, setSavedQuestionCharacterId] = useState<
    number | null
  >(null);
  const [savedOptionCharacterIds, setSavedOptionCharacterIds] = useState<
    number[] | null
  >(null);

  // ID usado como límite máximo en la generación de IDs aleatorios.
  const [maxCharacterId, setMaxCharacterId] = useState<number | null>(null);

  // Personaje preguntado.
  const [questionCharacter, setQuestionCharacter] =
    useState<CharacterType | null>(null);

  // Opciones de respuesta.
  const [optionCharacters, setOptionCharacters] = useState<CharacterType[]>([]);

  // Indica si la respuesta es correcta o no. Es NULL cuando no se ha respondido aún.
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  // Puntaje del jugador.
  const [score, setScore] = useState<ScoreType>({ total: 0, correct: 0 });

  // Configuración del juego.
  const [settings, setSettings] = useState<SettingsType>({
    language: i18n.language as "es" | "en",
    questionMode: "series",
    mediaType: null,
    seriesTitleLanguage: "english",
    mediaNsfw: true,
  });

  // Contexto donde ocurrió un error.
  const [errorContext, setErrorContext] = useState<ErrorType>(null);

  // Mensaje de cambios aplicados.
  const toastChanges = (): void => {
    toast.dismiss();
    toast.success(t("settings.changesApplied"));
  };

  // Obtiene personajes aleatorios desde AniList.
  const fetchRandomCharacters = (): void => {
    if (!maxCharacterId) return;

    const excludedIds = new Set(usedCharacterIds);
    const totalIds = answerOptionCount * (settings.mediaNsfw ? 3 : 4);

    const randomIds: number[] =
      savedOptionCharacterIds ??
      generateUniqueIds(totalIds, maxCharacterId, excludedIds);

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
          answerOptionCount - optionCharacters.length,
        );

        setSavedOptionCharacterIds(null);

        setOptionCharacters((c) => [...c, ...filtered]);
      })
      .catch((error) => {
        if (import.meta.env.DEV) console.error(error);
        setErrorContext("quiz");
      });
  };

  const getCharacters = () => {
    if (optionCharacters.length < answerOptionCount) {
      fetchRandomCharacters();
    }
  };

  // Elige aleatoriamente un personaje para preguntar.
  // Si existe un ID recuperado del almacenamiento local,
  // se restaura el personaje previamente preguntado.
  const buildQuestion = () => {
    let selected: CharacterType | undefined;

    if (savedQuestionCharacterId) {
      selected = optionCharacters.find(
        (character) => character.id === savedQuestionCharacterId,
      );
      setSavedQuestionCharacterId(null);
    }

    if (!selected) {
      const index = getRandomInt(0, answerOptionCount - 1);
      selected = optionCharacters[index];
    }

    setQuestionCharacter(selected);

    setUsedCharacterIds((prev) =>
      [...prev, selected.id].slice(-usedCharactersLimit),
    );
  };

  // Verifica si la respuesta es correcta y actualiza el puntaje de la partida.
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
    setScore({ total: 0, correct: 0 });

    toastChanges();
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

    if (key === "language") i18n.changeLanguage(value);

    if (triggerNewQuestion) newQuestion();

    toastChanges();
  };

  // Reintenta la acción según el contexto del error.
  const resumeFlow = () => {
    if (errorContext === "init") init();
    if (errorContext === "quiz") getCharacters();
    setErrorContext(null);
  };

  // Inicialización del estado del juego.
  // Restaura datos locales y obtiene el límite de personajes.
  const init = useCallback(() => {
    const localState = loadGameState();

    if (localState) {
      setUsedCharacterIds(localState.usedCharacterIds);
      setSavedOptionCharacterIds(localState.optionCharacterIds ?? null);
      setSavedQuestionCharacterId(localState.questionCharacterId ?? null);
      setScore(localState.score);
      setSettings(localState.settings);
    }

    fetchLastCharacterId()
      .then((id) => setMaxCharacterId(id))
      .catch((error) => {
        if (import.meta.env.DEV) console.error(error);
        setErrorContext("init");
      });
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    getCharacters();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxCharacterId, optionCharacters]);

  useEffect(() => {
    if (optionCharacters.length === answerOptionCount) {
      buildQuestion();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionCharacters]);

  // Guarda en el almacenamiento local del navegador la información del juego.
  // La pregunta activa solo se almacena mientras no haya sido respondida.
  useEffect(() => {
    if (!maxCharacterId) return;

    saveGameState({
      usedCharacterIds,
      optionCharacterIds:
        isAnswerCorrect === null && optionCharacters.length
          ? optionCharacters.map((c) => c.id)
          : null,
      questionCharacterId:
        isAnswerCorrect === null ? (questionCharacter?.id ?? null) : null,
      score,
      settings,
    });
  }, [
    maxCharacterId,
    usedCharacterIds,
    optionCharacters,
    questionCharacter,
    isAnswerCorrect,
    score,
    settings,
  ]);

  return {
    maxCharacterId,
    usedCharacterIds,
    optionCharacters,
    questionCharacter,
    isAnswerCorrect,
    score,
    settings,
    errorContext,
    checkAnswer,
    newQuestion,
    resetScore,
    saveSettings,
    resumeFlow,
  };
}
