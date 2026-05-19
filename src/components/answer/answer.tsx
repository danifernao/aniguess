import CharacterImage from "@/components/image/image/image";
import type { CharacterType } from "@/types/types";
import Tooltip from "@components/tooltip/tooltip";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./answer.module.css";

interface AnswerProps {
  questionMode: "character" | "series";
  questionCharacter: CharacterType;
  isCorrect: boolean;
  newQuestion: () => void;
  seriesTitleLanguage: "english" | "romaji";
}

function Answer({
  questionMode,
  questionCharacter,
  isCorrect,
  newQuestion,
  seriesTitleLanguage,
}: AnswerProps) {
  const { t } = useTranslation();

  // Avanza a la siguiente pregunta presionando la tecla "n".
  const handleShortcut = useCallback(
    (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "n") {
        newQuestion();
      }
    },
    [newQuestion],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleShortcut);

    return () => {
      document.removeEventListener("keydown", handleShortcut);
    };
  }, [handleShortcut]);

  return (
    <div
      className={`${styles.answer} ${isCorrect ? styles.correct : styles.incorrect}`}
    >
      <div className={styles.content}>
        <p className={styles.title}>
          <b>{isCorrect ? t("answer.correct") : t("answer.incorrect")}</b>
        </p>

        <CharacterImage
          src={questionCharacter.image.large}
          alt={t("answer.image_alt", {
            name: questionCharacter.name.full,
          })}
        />

        <div className={`${styles.details} ${styles[questionMode]}`}>
          <p className={styles.answerCharacter}>
            <a
              href={questionCharacter.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {questionCharacter.name.full}
              <FontAwesomeIcon
                icon={faArrowUpRightFromSquare}
                className={styles.linkIcon}
                aria-hidden="true"
              />
            </a>
          </p>

          <p className={styles.answerSeries}>
            {questionCharacter.media.nodes[0].isAdult && (
              <Tooltip content={t("answer.nsfwTooltip")}>
                <button
                  className={styles.nsfwBadge}
                  aria-label={t("answer.nsfwLabel")}
                >
                  +18
                </button>
              </Tooltip>
            )}

            <a
              href={questionCharacter.media.nodes[0].siteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {seriesTitleLanguage === "english"
                ? questionCharacter.media.nodes[0].title.english ||
                  questionCharacter.media.nodes[0].title.romaji
                : questionCharacter.media.nodes[0].title.romaji ||
                  questionCharacter.media.nodes[0].title.english}
              <FontAwesomeIcon
                icon={faArrowUpRightFromSquare}
                className={styles.linkIcon}
                aria-hidden="true"
              />
            </a>
          </p>
        </div>
      </div>

      <button
        onClick={newQuestion}
        className={styles.next}
        aria-keyshortcuts="n"
      >
        {t("answer.next")}
      </button>
    </div>
  );
}

export default Answer;
