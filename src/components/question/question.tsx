import CharacterImage from "@/components/image/image/image";
import { CharacterType } from "@/types/types";
import ImageFlag from "@components/image/flag/flag";
import Tooltip from "@components/tooltip/tooltip";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import styles from "./question.module.css";

interface QuestionProps {
  questionMode: "character" | "series";
  questionCharacter: CharacterType;
  answerOptions: CharacterType[];
  hiddenOptionIds: number[];
  availableHints: number;
  seriesTitleLanguage: "english" | "romaji";
  triggerHint: () => void;
  checkAnswer: (char: CharacterType) => void;
  newQuestion: () => void;
}

function Question({
  questionMode,
  questionCharacter,
  answerOptions,
  hiddenOptionIds,
  availableHints,
  seriesTitleLanguage,
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
  const canUseHint = availableHints > 0 && hiddenOptionIds.length < maxHints;

  // Activa una pista o notifica al usuario por qué no está disponible.
  const handleHint = useCallback(() => {
    if (canUseHint) {
      triggerHint();
    } else {
      if (availableHints <= 0) {
        toast.warning(t("question.hint.notAvailable"));
      } else {
        toast.warning(t("question.hint.maxReached"));
      }
    }
  }, [canUseHint, triggerHint, availableHints, t]);

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

      if (e.key.toLowerCase() === "h") {
        handleHint();
      }
    },
    [answerOptions, checkAnswer, isOptionHidden, handleHint],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleShortcut);

    return () => {
      document.removeEventListener("keydown", handleShortcut);
    };
  }, [handleShortcut]);

  return (
    <div className={styles.question}>
      <div className={styles.image}>
        <CharacterImage
          src={questionCharacter.image.large}
          alt={t("question.image_alt")}
          onLoad={() => setIsImageReady(true)}
        />

        {import.meta.env.VITE_FUNCTIONS_ENABLED && isImageReady && (
          <ImageFlag
            src={questionCharacter.image.large}
            newQuestion={newQuestion}
          />
        )}
      </div>

      <div>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {questionMode === "character"
              ? t("question.character")
              : t("question.series")}
          </h2>

          <Tooltip content={t("question.hint.tooltip")}>
            <button
              type="button"
              className={`${styles.hint} ${canUseHint ? styles.available : ""}`}
              onClick={handleHint}
              aria-keyshortcuts="h"
              aria-label={t("question.hint.label", {
                total: availableHints,
              })}
            >
              <FontAwesomeIcon icon={faLightbulb} aria-hidden="true" />
              <sup aria-hidden="true">{availableHints}</sup>
            </button>
          </Tooltip>
        </div>

        {answerOptions.map((character: CharacterType, index: number) => (
          <div
            className={`${styles.options} ${isOptionHidden(character.id) ? styles.hidden : ""}`}
            key={character.id}
          >
            <input
              type="radio"
              id={`media-${character.id}`}
              value={character.id}
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
