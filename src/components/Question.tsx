import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { CharacterType } from "../types/types";
import CharacterImage from "./CharacterImage";
import QuestionImageFlag from "./QuestionImageFlag";
import Tooltip from "./Tooltip";

interface QuestionProps {
  questionMode: "character" | "series";
  questionCharacter: CharacterType;
  answerOptions: CharacterType[];
  hiddenOptionIds: number[];
  isHintAvailable: boolean;
  seriesTitleLanguage: "english" | "romaji";
  setHintAvailability: (value: boolean) => void;
  triggerHint: () => void;
  checkAnswer: (char: CharacterType) => void;
  newQuestion: () => void;
}

function Question({
  questionMode,
  questionCharacter,
  answerOptions,
  hiddenOptionIds,
  isHintAvailable,
  seriesTitleLanguage,
  setHintAvailability,
  triggerHint,
  checkAnswer,
  newQuestion,
}: QuestionProps) {
  const { t } = useTranslation();

  // Controla si la acción de selección se realizó mediante teclado
  // para evitar validar la respuesta en eventos onChange.
  const isKeyboardAction = useRef(false);

  // Indica si el proceso de carga de la imagen del personaje ya finalizó
  // para permitir mostrar la pista después de un tiempo.
  const [isImageReady, setIsImageReady] = useState(false);

  // Número máximo de opciones que se pueden descartar.
  const maxHints = Math.floor(answerOptions.length / 2);

  // Indica si se pueden usar pistas (si no se han descartado demasiadas opciones).
  const canUseHint = hiddenOptionIds.length < maxHints;

  // Determina si una opción ha sido descartada por una pista.
  const isOptionHidden = useCallback(
    (id: number) => hiddenOptionIds.includes(id),
    [hiddenOptionIds],
  );

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

      if (!isNaN(index) && index >= 0 && index < answerOptions.length) {
        character = answerOptions[index];
      }

      if (character && !isOptionHidden(character.id)) {
        checkAnswer(character);
      }

      if (e.key.toLowerCase() === "h" && isHintAvailable) {
        triggerHint();
      }
    },
    [answerOptions, checkAnswer, isHintAvailable, isOptionHidden, triggerHint],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleShortcut);

    return () => {
      document.removeEventListener("keydown", handleShortcut);
    };
  }, [handleShortcut]);

  // Muestra una pista después de un minuto.
  useEffect(() => {
    if (isHintAvailable || !canUseHint || !isImageReady) return;

    const timer = setTimeout(() => {
      setHintAvailability(true);
    }, 20000);

    return () => clearTimeout(timer);
  }, [isHintAvailable, canUseHint, setHintAvailability, isImageReady]);

  return (
    <div className="question">
      <div className="question-image-wrapper">
        <CharacterImage
          src={questionCharacter.image.large}
          alt={t("question.image_alt")}
          className="question-image"
          onComplete={() => setIsImageReady(true)}
        />

        {import.meta.env.VITE_FUNCTIONS_ENABLED && isImageReady && (
          <QuestionImageFlag
            questionCharacter={questionCharacter}
            newQuestion={newQuestion}
          />
        )}
      </div>

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
            <Tooltip content={t("question.hintTooltip")}>
              <button
                type="button"
                className="question-hint"
                onClick={triggerHint}
                aria-keyshortcuts="h"
                aria-label={t("question.hintLabel")}
              >
                <FontAwesomeIcon icon={faLightbulb} aria-hidden="true" />
              </button>
            </Tooltip>
          )}
        </div>

        {answerOptions.map((character: CharacterType, index: number) => (
          <div
            className={`question-options ${isOptionHidden(character.id) ? "hidden" : ""}`}
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
              disabled={isOptionHidden(character.id)}
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
