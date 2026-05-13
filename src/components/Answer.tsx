import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import type { CharacterType } from "../types/types";
import { useTranslation } from "react-i18next";
import CharacterImage from "./CharacterImage";

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

  return (
    <div id="answer" className={`${isCorrect ? "correct" : "incorrect"}`}>
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
            <a href={questionCharacter.siteUrl} target="_blank">
              {questionCharacter.name.full}
              <FontAwesomeIcon
                icon={faArrowUpRightFromSquare}
                className="link-icon"
                aria-hidden="true"
              />
            </a>
          </p>

          <p className="answer-series">
            <a href={questionCharacter.media.nodes[0].siteUrl} target="_blank">
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

      <button onClick={newQuestion} className="next-question">
        {t("answer.next")}
      </button>
    </div>
  );
}

export default Answer;
