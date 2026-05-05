import type { CharacterType } from "../types/types";
import { useTranslation } from "react-i18next";

interface AnswerProps {
  questionCharacter: CharacterType;
  isCorrect: boolean;
  playAgain: () => void;
}

function Answer({ questionCharacter, isCorrect, playAgain }: AnswerProps) {
  const { t } = useTranslation();

  return (
    <div className={`answer ${isCorrect ? "correct" : "incorrect"}`}>
      <div>
        <p className="title">
          <b>{isCorrect ? t("answer.correct") : t("answer.incorrect")}</b>
        </p>

        <img src={questionCharacter.image.large} alt="" />

        <div className="description">
          <p>
            <a href={questionCharacter.siteUrl} target="_blank">
              {questionCharacter.name!.full}
            </a>
          </p>

          <p>
            <a href={questionCharacter.media.nodes[0].siteUrl} target="_blank">
              {questionCharacter.media.nodes[0].title.english ||
                questionCharacter.media.nodes[0].title.romaji}
            </a>
          </p>
        </div>
      </div>

      <button onClick={playAgain}>{t("answer.next")}</button>
    </div>
  );
}

export default Answer;
