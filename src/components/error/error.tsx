import { faPlugCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Trans } from "react-i18next";
import styles from "./error.module.css";

interface ErrorProps {
  resume: () => void;
}

function Error({ resume }: ErrorProps) {
  return (
    <div className={styles.error} role="alert">
      <FontAwesomeIcon
        icon={faPlugCircleXmark}
        aria-hidden="true"
        className={styles.icon}
      />
      <p className={styles.message}>
        <Trans i18nKey="error.message">
          <button type="button" className="link" onClick={resume} />
        </Trans>
      </p>
    </div>
  );
}

export default Error;
