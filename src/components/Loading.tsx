import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

function Loading() {
  const { t } = useTranslation();

  return (
    <div id="loading" role="status">
      <FontAwesomeIcon icon={faCircleNotch} spin aria-hidden="true" />
      <p>{t("loading.message")}</p>
    </div>
  );
}

export default Loading;
