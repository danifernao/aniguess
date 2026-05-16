import type { ScoreType } from "../types/types";
import "react-circular-progressbar/dist/styles.css";
import { CircularProgressbar } from "react-circular-progressbar";
import { useTranslation } from "react-i18next";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import ShareCard from "./ShareCard";
import { toPng } from "html-to-image";
import { toast } from "sonner";

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

  const cardRef = useRef<HTMLDivElement>(null);

  // Genera y descarga una imagen con las estadísticas del jugador.
  const downloadImage = () => {
    if (!cardRef.current) return;

    toPng(cardRef.current, {
      cacheBust: true,
      pixelRatio: 2,
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "aniguess-score.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        if (import.meta.env.DEV) console.error(error);
        toast.error(t("stats.share.error"));
      });
  };

  return (
    <div className="stats">
      <div className="stats-score-wrapper">
        <div
          className="stats-score"
          title={scoreLabel}
          aria-label={scoreLabel}
          role="status"
        >
          {score.correct} / {score.total}
        </div>

        <button
          className="stats-share button-unstyled icon-link"
          title={t("stats.share.label")}
          aria-label={t("stats.share.label")}
          onClick={downloadImage}
        >
          <FontAwesomeIcon icon={faShare} aria-hidden="true" />
        </button>

        <div ref={cardRef} className="share-card-wrapper" aria-hidden="true">
          <ShareCard
            correct={score.correct}
            total={score.total}
            percentage={percentage}
          />
        </div>
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
