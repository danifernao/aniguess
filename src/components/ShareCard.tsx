import { Trans, useTranslation } from "react-i18next";

interface ShareCardProps {
  correct: number;
  total: number;
  percentage: number;
}

function ShareCard({ correct, total, percentage }: ShareCardProps) {
  const { t } = useTranslation();

  const rank =
    total >= 500 && percentage >= 70
      ? {
          title: t("shareCard.rank.sensei"),
          medal: "🏯",
          className: "sensei",
        }
      : total >= 200 && percentage >= 60
        ? {
            title: t("shareCard.rank.otaku"),
            medal: "🌸",
            className: "otaku",
          }
        : total >= 50 && percentage >= 40
          ? {
              title: t("shareCard.rank.enthusiast"),
              medal: "📺",
              className: "enthusiast",
            }
          : {
              title: t("shareCard.rank.casual"),
              medal: "🛋️",
              className: "casual",
            };

  return (
    <div className={`share-card ${rank.className}`}>
      <div className="share-card-main">
        <div className="share-card-header">
          <span className="share-card-medal">{rank.medal}</span>
          <span className="share-card-rank">{rank.title}</span>
        </div>

        <div className="share-card-percentage">
          <span className="share-card-percentage-value">{percentage}%</span>
          <span className="share-card-percentage-label">
            {t("shareCard.accuracy")}
          </span>
        </div>

        <div className="share-card-details">
          <div className="share-card-details-label">
            {t("shareCard.totalQuestions")}
          </div>
          <div className="share-card-details-value">{total}</div>

          <div className="share-card-details-label">
            {t("shareCard.correctAnswers")}
          </div>
          <div className="share-card-details-value">{correct}</div>
        </div>
      </div>

      <div className="share-card-footer">
        <Trans
          i18nKey="shareCard.footer"
          values={{
            host: location.hostname,
          }}
        >
          <b />
        </Trans>
      </div>
    </div>
  );
}

export default ShareCard;
