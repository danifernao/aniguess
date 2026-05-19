import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import styles from "./loading.module.css";

function Loading() {
  const { t } = useTranslation();

  return (
    <div className={styles.loading} role="status">
      <FontAwesomeIcon
        icon={faCircleNotch}
        spin
        aria-hidden="true"
        className={styles.icon}
      />
      <p>{t("loading.message")}</p>
    </div>
  );
}

export default Loading;
