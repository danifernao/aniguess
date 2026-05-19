import type { ScoreType } from "@/types/types";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useTranslation } from "react-i18next";
import StatsShare from "../share/share";
import styles from "./stats.module.css";

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
    <div className={styles.stats}>
      <div className={styles.scoreWrapper}>
        <div
          className={styles.score}
          title={scoreLabel}
          aria-label={scoreLabel}
          role="status"
        >
          {score.correct} / {score.total}
        </div>

        <StatsShare
          total={score.total}
          correct={score.correct}
          percentage={percentage}
        />
      </div>

      <div aria-label={t("stats.progress", { percentage })}>
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          strokeWidth={10}
          className={`${styles.progress} ${styles[status]}`}
        />
      </div>
    </div>
  );
}

export default Stats;
