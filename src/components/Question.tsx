import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CharacterType } from "../types/types";
import { useTranslation } from "react-i18next";
import { shuffle } from "../utils/shuffle";
import CharacterImage from "./CharacterImage";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CustomTooltip from "./Tooltip";

interface QuestionProps {
  questionMode: "character" | "series";
  seriesTitleLanguage: "english" | "romaji";
  optionCharacters: CharacterType[];
  questionCharacter: CharacterType;
  isHintAvailable: boolean;
  setHintAvailability: (value: boolean) => void;
  checkAnswer: (char: CharacterType) => void;
}

function Question({
  questionMode,
  seriesTitleLanguage,
  optionCharacters,
  questionCharacter,
  isHintAvailable,
  setHintAvailability,
  checkAnswer,
}: QuestionProps) {
  const { t } = useTranslation();

  const isKeyboardAction = useRef(false);

  // Mezcla las opciones de respuesta.
  const shuffledCharacters = useMemo(() => {
    return shuffle([...optionCharacters]);
  }, [optionCharacters]);

  // Opciones descartadas por las pistas.
  const [hiddenOptionIds, setHiddenOptionIds] = useState<number[]>([]);

  // Número máximo de opciones que se pueden descartar.
  const maxHints = Math.floor(shuffledCharacters.length / 2);

  // Determina si se pueden usar pistas.
  const canUseHint = hiddenOptionIds.length < maxHints;

  // Determina si una opción ha sido descartada.
  const isHidden = useCallback(
    (id: number) => hiddenOptionIds.includes(id),
    [hiddenOptionIds],
  );

  // Descarta (por ID menor) una opción incorrecta .
  const handleHint = useCallback(() => {
    const wrongOptions = shuffledCharacters.filter(
      (c) => c.id !== questionCharacter.id && !isHidden(c.id),
    );

    const selected = wrongOptions.reduce((min, current) =>
      current.id < min.id ? current : min,
    );

    setHiddenOptionIds((ids) => [...ids, selected.id]);
    setHintAvailability(false);
  }, [isHidden, questionCharacter.id, setHintAvailability, shuffledCharacters]);

  // Si no se usa teclado, valida la respuesta cuando input cambia.
  const handleChange = (character: CharacterType) => {
    if (!isKeyboardAction.current) {
      checkAnswer(character);
    }

    isKeyboardAction.current = false;
  };

  // Si se usa teclado, valida la respuesta solo cuando se presiona Enter o espacio.
  const handleKeyDown = (e: React.KeyboardEvent, character: CharacterType) => {
    if (
      e.key === "ArrowUp" ||
      e.key === "ArrowDown" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight"
    ) {
      isKeyboardAction.current = true;
    }

    if (e.key === "Enter" || e.key === " ") {
      checkAnswer(character);
    }
  };

  // Gestiona los atajos:
  // - Selecciona una opción usando las teclas numéricas.
  // - Usa pista si está disponible.
  const handleShortcut = useCallback(
    (e: KeyboardEvent) => {
      let character = null;
      const index = parseInt(e.key) - 1;

      if (!isNaN(index) && index >= 0 && index < shuffledCharacters.length) {
        character = shuffledCharacters[index];
      }

      if (character && !isHidden(character.id)) {
        checkAnswer(character);
      }

      if (e.key.toLowerCase() === "h" && isHintAvailable) {
        handleHint();
      }
    },
    [shuffledCharacters, checkAnswer, isHintAvailable, isHidden, handleHint],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleShortcut);

    return () => {
      document.removeEventListener("keydown", handleShortcut);
    };
  }, [handleShortcut]);

  // Muestra una pista después de un minuto.
  useEffect(() => {
    if (isHintAvailable || !canUseHint) return;

    const timer = setTimeout(() => {
      setHintAvailability(true);
    }, 60000);

    return () => clearTimeout(timer);
  }, [isHintAvailable, canUseHint, setHintAvailability]);

  // Reinicia el estado de la pista al desmontar la pregunta actual.
  useEffect(() => {
    return () => {
      setHintAvailability(false);
    };
  }, [setHintAvailability]);

  return (
    <div className="question">
      <CharacterImage
        src={questionCharacter.image.large}
        alt={t("question.image_alt")}
        className="question-image"
      />

      <div className="question-block">
        <div
          className={`question-header ${isHintAvailable ? "hint-available" : ""}`}
        >
          <h2 className="question-title">
            {questionMode === "character"
              ? t("question.character")
              : t("question.series")}
          </h2>

          {isHintAvailable && (
            <CustomTooltip content={t("question.hintTooltip")}>
              <button
                type="button"
                className="question-hint"
                onClick={handleHint}
                aria-keyshortcuts="h"
              >
                <FontAwesomeIcon icon={faLightbulb} />
              </button>
            </CustomTooltip>
          )}
        </div>

        {shuffledCharacters.map((character: CharacterType, index: number) => (
          <div
            className={`question-options ${isHidden(character.id) ? "hidden" : ""}`}
            key={character.id}
          >
            <input
              type="radio"
              id={`media-${character.id}`}
              value={character.id}
              name="series-title"
              onChange={() => handleChange(character)}
              onKeyDown={(e) => handleKeyDown(e, character)}
              aria-keyshortcuts={`${index + 1}`}
              disabled={isHidden(character.id)}
            />
            <label htmlFor={`media-${character.id}`}>
              {questionMode === "character"
                ? character.name.full
                : seriesTitleLanguage === "english"
                  ? character.media.nodes[0].title.english ||
                    character.media.nodes[0].title.romaji
                  : character.media.nodes[0].title.romaji ||
                    character.media.nodes[0].title.english}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Question;
