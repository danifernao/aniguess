import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

interface LoadingProps {
  errorFound: boolean;
}

function Loading({ errorFound }: LoadingProps) {
  const { t } = useTranslation();

  return (
    <div id="loading" className={`${errorFound ? "error" : ""}`} role="status">
      {errorFound ? (
        <p>{t("loading.error")}</p>
      ) : (
        <>
          <FontAwesomeIcon icon={faCircleNotch} spin aria-hidden="true" />
          <p>{t("loading.message")}</p>
        </>
      )}
    </div>
  );
}

export default Loading;
