import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import type { CharacterType } from "../types/types";
import { useTranslation } from "react-i18next";
import CharacterImage from "./CharacterImage";
import { useCallback, useEffect } from "react";
import CustomTooltip from "./Tooltip";

interface AnswerProps {
  questionMode: "character" | "series";
  seriesTitleLanguage: "english" | "romaji";
  questionCharacter: CharacterType;
  isCorrect: boolean;
  newQuestion: () => void;
}

function Answer({
  questionMode,
  seriesTitleLanguage,
  questionCharacter,
  isCorrect,
  newQuestion,
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
    <div className={`answer ${isCorrect ? "correct" : "incorrect"}`}>
      <div className="answer-content">
        <p className="answer-result">
          <b>{isCorrect ? t("answer.correct") : t("answer.incorrect")}</b>
        </p>

        <CharacterImage
          src={questionCharacter.image.large}
          alt={t("answer.image_alt", {
            name: questionCharacter.name.full,
          })}
          className="answer-image"
        />

        <div className={`answer-details ${questionMode}`}>
          <p className="answer-character">
            <a
              href={questionCharacter.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {questionCharacter.name.full}
              <FontAwesomeIcon
                icon={faArrowUpRightFromSquare}
                className="link-icon"
                aria-hidden="true"
              />
            </a>
          </p>

          <p className="answer-series">
            {questionCharacter.media.nodes[0].isAdult && (
              <CustomTooltip content={t("answer.nsfwTooltip")}>
                <button className="nsfw-badge">+18</button>
              </CustomTooltip>
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
                className="link-icon"
                aria-hidden="true"
              />
            </a>
          </p>
        </div>
      </div>

      <button
        onClick={newQuestion}
        className="next-question"
        aria-keyshortcuts="n"
      >
        {t("answer.next")}
      </button>
    </div>
  );
}

export default Answer;
