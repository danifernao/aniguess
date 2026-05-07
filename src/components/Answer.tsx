import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import type { CharacterType } from "../types/types";
import { useTranslation } from "react-i18next";

interface AnswerProps {
  questionMode: "character" | "series";
  questionCharacter: CharacterType;
  isCorrect: boolean;
  newQuestion: () => void;
}

function Answer({
  questionMode,
  questionCharacter,
  isCorrect,
  newQuestion,
}: AnswerProps) {
  const { t } = useTranslation();

  return (
    <div className={`answer ${isCorrect ? "correct" : "incorrect"}`}>
      <div>
        <p className="title">
          <b>{isCorrect ? t("answer.correct") : t("answer.incorrect")}</b>
        </p>

        <img src={questionCharacter.image.large} alt="" />

        <div className={`description ${questionMode}`}>
          <p>
            <a href={questionCharacter.siteUrl} target="_blank">
              {questionCharacter.name!.full}
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </a>
          </p>

          <p>
            <a href={questionCharacter.media.nodes[0].siteUrl} target="_blank">
              {questionCharacter.media.nodes[0].title.english ||
                questionCharacter.media.nodes[0].title.romaji}
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </a>
          </p>
        </div>
      </div>

      <button onClick={newQuestion}>{t("answer.next")}</button>
    </div>
  );
}

export default Answer;
