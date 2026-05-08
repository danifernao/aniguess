import type { ScoreType } from "../types/types";
import "react-circular-progressbar/dist/styles.css";
import { CircularProgressbar } from "react-circular-progressbar";
import { useTranslation } from "react-i18next";

interface ScoreProps {
  score: ScoreType;
}

function Score({ score }: ScoreProps) {
  const { t } = useTranslation();

  const percentage =
    score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  const getScoreStatus = (): string => {
    if (score.total === 0) {
      return "neutral";
    }

    if (percentage >= 70) {
      return "good";
    }

    if (percentage >= 50) {
      return "medium";
    }

    return "bad";
  };

  return (
    <div id="score">
      <div
        className="stats"
        title={`${t("score.correct", { count: score.correct })} ${t("common.of")} ${t("score.question", { count: score.total })}`}
      >
        {score.correct} / {score.total}
      </div>

      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        strokeWidth={10}
        className={`progress-bar ${getScoreStatus()}`}
      />
    </div>
  );
}

export default Score;
