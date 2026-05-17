import { useTranslation } from "react-i18next";
import { faCircleNotch, faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import StatsShareCard from "./StatsShareCard";
import { toPng } from "html-to-image";
import { toast } from "sonner";

interface StatsShare {
  total: number;
  correct: number;
  percentage: number;
}

function StatsShare({ total, correct, percentage }: StatsShare) {
  const { t } = useTranslation();

  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Genera y descarga una imagen con las estadísticas del jugador.
  const downloadImage = () => {
    if (!cardRef.current) return;

    setIsDownloading(true);

    toPng(cardRef.current, {
      cacheBust: true,
      pixelRatio: 2,
    })
      .then((dataUrl) => {
        const link = document.createElement("a");

        link.download = "quiz-score.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        if (import.meta.env.DEV) console.error(error);
        toast.error(t("stats.share.error"));
      })
      .finally(() => {
        setIsDownloading(false);
      });
  };

  return (
    <div className="stats-share">
      <button
        className="stats-share-button button-unstyled icon-link"
        title={t("stats.share.label")}
        aria-label={t("stats.share.label")}
        aria-busy={isDownloading}
        disabled={isDownloading}
        onClick={downloadImage}
      >
        {isDownloading ? (
          <FontAwesomeIcon icon={faCircleNotch} spin aria-hidden="true" />
        ) : (
          <FontAwesomeIcon icon={faShare} aria-hidden="true" />
        )}
      </button>

      <div
        ref={cardRef}
        className="stats-share-card-wrapper"
        aria-hidden="true"
      >
        <StatsShareCard
          correct={correct}
          total={total}
          percentage={percentage}
        />
      </div>
    </div>
  );
}

export default StatsShare;
