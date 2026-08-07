import { audioManager } from "@/audio/audio";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { filterValidCharacters } from "../filters/characters";
import i18n from "../i18n";
import { fetchAniListData } from "../services/anilist";
import { getMaxCharacterId } from "../services/max-character-id";
import { loadGameState, saveGameState } from "../storage/gameState";
import type {
  CharacterType,
  ErrorType,
  ScoreType,
  SettingsType,
} from "../types/types";
import { generateUniqueIds, getRandomInt } from "../utils/random";
import { shuffle } from "../utils/shuffle";

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

  // Número máximo de pistas acumulables.
  const maxHints = 3;

  // Número de pistas por pregunta.
  const hintsPerQuestions = 5;

  // Número de pistas disponibles.
  const [availableHints, setAvailableHints] = useState(1);

  // Opciones descartadas por las pistas.
  const [hiddenOptionIds, setHiddenOptionIds] = useState<number[]>([]);

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
    includeAdultMedia: true,
    enableSoundEffects: true,
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

    const needsLargerPool = settings.mediaType || !settings.includeAdultMedia;
    const poolMultiplier = needsLargerPool ? 6 : 3;
    const totalIds = answerOptionCount * poolMultiplier;

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
              relations {
                nodes {
                  id
                }
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
            includeAdultMedia: settings.includeAdultMedia,
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

  // Mezcla las opciones de respuesta.
  const answerOptions = useMemo(() => {
    return shuffle([...optionCharacters]);
  }, [optionCharacters]);

  // Proporciona una pista ocultando una opción incorrecta.
  const triggerHint = useCallback((): void => {
    if (!questionCharacter || availableHints <= 0) return;

    const wrongOptions = optionCharacters.filter(
      (c) => c.id !== questionCharacter.id && !hiddenOptionIds.includes(c.id),
    );

    const selected = wrongOptions.reduce((min, current) =>
      current.id < min.id ? current : min,
    );

    setHiddenOptionIds((prev) => [...prev, selected.id]);

    setAvailableHints((prev) => prev - 1);
  }, [optionCharacters, hiddenOptionIds, questionCharacter, availableHints]);

  // Verifica si la respuesta es correcta y actualiza el puntaje de la partida.
  const checkAnswer = (selected: CharacterType): void => {
    const isCorrect = selected.id === questionCharacter!.id;

    setIsAnswerCorrect(isCorrect);

    if (settings.enableSoundEffects) {
      if (isCorrect) {
        audioManager.playSuccess();
      } else {
        audioManager.playError();
      }
    }

    if ((score.total + 1) % hintsPerQuestions === 0) {
      setAvailableHints((prev) => Math.min(prev + 1, maxHints));
    }

    setScore((s) => ({
      total: s.total + 1,
      correct: isCorrect ? s.correct + 1 : s.correct,
    }));
  };

  // Procede con una nueva pregunta.
  const newQuestion = (): void => {
    setOptionCharacters([]);
    setHiddenOptionIds([]);
    setQuestionCharacter(null);
    setIsAnswerCorrect(null);
  };

  // Reinicia el puntaje.
  const resetScore = () => {
    setScore({ total: 0, correct: 0 });
    setAvailableHints(1);

    toastChanges();
  };

  // Guarda las opciones de configuración del juego.
  const saveSettings = <K extends keyof SettingsType>(
    key: K,
    value: SettingsType[K],
    triggerNewQuestion: boolean = true,
  ): void => {
    setSettings((s) => ({
      ...s,
      [key]:
        key === "mediaType"
          ? value === "NULL"
            ? null
            : value
          : key === "includeAdultMedia"
            ? value === "true"
            : value,
    }));

    if (key === "language") i18n.changeLanguage(value as string);

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

    setUsedCharacterIds(localState.usedCharacterIds);
    setSavedOptionCharacterIds(localState.optionCharacterIds);
    setSavedQuestionCharacterId(localState.questionCharacterId);
    setAvailableHints(Math.min(localState.availableHints, maxHints));
    setScore(localState.score);
    setSettings(localState.settings);

    getMaxCharacterId()
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

    const currentState = loadGameState();

    saveGameState({
      ...currentState,
      usedCharacterIds,
      optionCharacterIds:
        isAnswerCorrect === null && optionCharacters.length
          ? optionCharacters.map((c) => c.id)
          : null,
      questionCharacterId:
        isAnswerCorrect === null ? (questionCharacter?.id ?? null) : null,
      availableHints,
      score,
      settings,
    });
  }, [
    maxCharacterId,
    usedCharacterIds,
    optionCharacters,
    questionCharacter,
    availableHints,
    isAnswerCorrect,
    score,
    settings,
  ]);

  return {
    questionCharacter,
    answerOptions,
    hiddenOptionIds,
    availableHints,
    isAnswerCorrect,
    score,
    settings,
    errorContext,
    triggerHint,
    checkAnswer,
    newQuestion,
    resetScore,
    saveSettings,
    resumeFlow,
  };
}
