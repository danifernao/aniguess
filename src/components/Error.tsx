import { faPlugCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Trans } from "react-i18next";

interface ErrorProps {
  resume: () => void;
}

function Error({ resume }: ErrorProps) {
  return (
    <div id="error" role="alert">
      <FontAwesomeIcon
        icon={faPlugCircleXmark}
        aria-hidden="true"
        className="error-icon"
      />
      <p className="error-message">
        <Trans i18nKey="error.message">
          <button type="button" onClick={resume} />
        </Trans>
      </p>
    </div>
  );
}

export default Error;
