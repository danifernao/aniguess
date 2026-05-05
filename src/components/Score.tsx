import type { ScoreType } from "../types/types";
import "react-circular-progressbar/dist/styles.css";
import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { useTranslation } from "react-i18next";

interface ScoreProps {
  score: ScoreType;
}

function Score({ score }: ScoreProps) {
  const { t } = useTranslation();
  const [percentage, setPercentage] = useState(0);

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

  useEffect(() => {
    setPercentage(
      score.total > 0 ? Math.trunc((score.correct / score.total) * 100) : 0,
    );
  }, [score]);

  return (
    <div
      className="score"
      title={t("score.summary", {
        correct: score.correct,
        total: score.total,
      })}
    >
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        strokeWidth={10}
        className={`progress ${getScoreStatus()}`}
      />
    </div>
  );
}

export default Score;
