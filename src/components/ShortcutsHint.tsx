import { faKeyboard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

interface ShortcutsHintProps {
  isQuestionReady: boolean;
  isAnswerReady: boolean;
  totalOptions: number;
}

function ShortcutsHint({
  isQuestionReady,
  isAnswerReady,
  totalOptions,
}: ShortcutsHintProps) {
  const { t } = useTranslation();

  if (!isQuestionReady && !isAnswerReady) return;

  return (
    <div
      className="shortcuts-hint"
      role="region"
      aria-label={t("shortcutsHint.regionLabel")}
    >
      <FontAwesomeIcon icon={faKeyboard} aria-hidden="true" />

      {isQuestionReady && (
        <>
          <span
            className="keys"
            aria-label={t("shortcutsHint.answerKeys", {
              total: totalOptions,
            })}
          >
            {Array.from({ length: totalOptions }).map((_, index) => {
              const number = index + 1;
              return (
                <kbd key={number} aria-hidden="true">
                  {number}
                </kbd>
              );
            })}
          </span>

          <span className="action">{t("shortcutsHint.selectAnswer")}</span>
        </>
      )}

      {isAnswerReady && (
        <>
          <span className="keys">
            <kbd>N</kbd>
          </span>
          <span className="action">{t("shortcutsHint.nextQuestion")}</span>
        </>
      )}
    </div>
  );
}

export default ShortcutsHint;
