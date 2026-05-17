import { faKeyboard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { CharacterType } from "../types/types";

interface KeyboardShortcutsProps {
  isQuestionReady: boolean;
  isAnswerReady: boolean;
  answerOptions: CharacterType[];
  hiddenOptionIds: number[];
  isHintAvailable: boolean;
  totalOptions: number;
}

function KeyboardShortcuts({
  isQuestionReady,
  isAnswerReady,
  answerOptions,
  hiddenOptionIds,
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
              <span className="shortcuts-hint-keys">
                <kbd>H</kbd>
              </span>

              <span className="shortcuts-hint-action">
                {t("keyboardShortcuts.useHint")}
              </span>
            </>
          )}

          {!isHintAvailable && (
            <>
              <span
                className="shortcuts-hint-keys"
                aria-label={t("keyboardShortcuts.answerShortcuts", {
                  total: totalOptions,
                })}
              >
                {answerOptions.map((option, index) => {
                  const isHidden = hiddenOptionIds.includes(option.id);

                  return (
                    <kbd
                      key={option.id}
                      className={isHidden ? "shortcut-disabled" : ""}
                      aria-disabled={isHidden}
                    >
                      {index + 1}
                    </kbd>
                  );
                })}
              </span>

              <span className="shortcuts-hint-action">
                {t("keyboardShortcuts.selectAnswer")}
              </span>
            </>
          )}
        </>
      )}

      {isAnswerReady && (
        <>
          <span className="shortcuts-hint-keys">
            <kbd>N</kbd>
          </span>
          <span className="shortcuts-hint-action">
            {t("keyboardShortcuts.nextQuestion")}
          </span>
        </>
      )}
    </div>
  );
}

export default KeyboardShortcuts;
