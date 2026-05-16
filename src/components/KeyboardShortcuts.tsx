import { faKeyboard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

interface KeyboardShortcutsProps {
  isQuestionReady: boolean;
  isAnswerReady: boolean;
  isHintAvailable: boolean;
  totalOptions: number;
}

function KeyboardShortcuts({
  isQuestionReady,
  isAnswerReady,
  isHintAvailable,
  totalOptions,
}: KeyboardShortcutsProps) {
  const { t } = useTranslation();

  if (!isQuestionReady && !isAnswerReady) return;

  return (
    <div
      className="shortcuts-hint"
      role="region"
      aria-label={t("keyboardShortcuts.regionLabel")}
    >
      <FontAwesomeIcon icon={faKeyboard} aria-hidden="true" />

      {isQuestionReady && (
        <>
          {isHintAvailable && (
            <>
              <span className="keys">
                <kbd>H</kbd>
              </span>

              <span className="action">{t("keyboardShortcuts.useHint")}</span>
            </>
          )}

          {!isHintAvailable && (
            <>
              <span
                className="keys"
                aria-label={t("keyboardShortcuts.answerShortcuts", {
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

              <span className="action">
                {t("keyboardShortcuts.selectAnswer")}
              </span>
            </>
          )}
        </>
      )}

      {isAnswerReady && (
        <>
          <span className="keys">
            <kbd>N</kbd>
          </span>
          <span className="action">{t("keyboardShortcuts.nextQuestion")}</span>
        </>
      )}
    </div>
  );
}

export default KeyboardShortcuts;
