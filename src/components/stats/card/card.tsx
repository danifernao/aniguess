import { Trans, useTranslation } from "react-i18next";
import styles from "./card.module.css";

interface StatsShareCardProps {
  correct: number;
  total: number;
  percentage: number;
}

function StatsShareCard({ correct, total, percentage }: StatsShareCardProps) {
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
    <div className={`${styles.card} ${styles[rank.className]}`}>
      <div className={styles.main}>
        <div className={styles.header}>
          <span className={styles.medal}>{rank.medal}</span>
          <span className={styles.rank}>{rank.title}</span>
        </div>

        <div className={styles.percentage}>
          <span className={styles.value}>{percentage}%</span>
          <span className={styles.label}>{t("shareCard.accuracy")}</span>
        </div>

        <div className={styles.details}>
          <div className={styles.label}>{t("shareCard.totalQuestions")}</div>
          <div className={styles.value}>{total}</div>

          <div className={styles.label}>{t("shareCard.correctAnswers")}</div>
          <div className={styles.value}>{correct}</div>
        </div>
      </div>

      <div className={styles.footer}>
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

export default StatsShareCard;
