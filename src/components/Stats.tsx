import type { ScoreType } from "../types/types";
import "react-circular-progressbar/dist/styles.css";
import { CircularProgressbar } from "react-circular-progressbar";
import { useTranslation } from "react-i18next";

interface StatsProps {
  score: ScoreType;
}

function Stats({ score }: StatsProps) {
  const { t } = useTranslation();

  const percentage =
    score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  const status =
    score.total === 0
      ? "neutral"
      : percentage >= 70
        ? "good"
        : percentage >= 50
          ? "medium"
          : "bad";

  const scoreLabel = `${t("stats.score.correct", { count: score.correct })} ${t("common.of")} ${t("stats.score.question", { count: score.total })}`;

  return (
    <div className="stats">
      <div
        className="stats-score"
        title={scoreLabel}
        aria-label={scoreLabel}
        role="status"
      >
        {score.correct} / {score.total}
      </div>

      <div aria-label={t("stats.progress", { percentage })}>
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          strokeWidth={10}
          className={`stats-progress ${status}`}
        />
      </div>
    </div>
  );
}

export default Stats;
