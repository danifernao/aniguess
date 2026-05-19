import { faKeyboard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { CharacterType } from "../../types/types";
import styles from "./shortcuts.module.css";

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
      className={styles.shortcuts}
      role="region"
      aria-label={t("keyboardShortcuts.regionLabel")}
    >
      <FontAwesomeIcon icon={faKeyboard} aria-hidden="true" />

      {isQuestionReady && (
        <>
          {isHintAvailable && (
            <>
              <span className={styles.keys}>
                <kbd>H</kbd>
              </span>

              <span className={styles.action}>
                {t("keyboardShortcuts.useHint")}
              </span>
            </>
          )}

          {!isHintAvailable && (
            <>
              <span
                className={styles.keys}
                aria-label={t("keyboardShortcuts.answerShortcuts", {
                  total: totalOptions,
                })}
              >
                {answerOptions.map((option, index) => {
                  const isHidden = hiddenOptionIds.includes(option.id);

                  return (
                    <kbd
                      key={option.id}
                      className={isHidden ? styles.disabled : ""}
                      aria-disabled={isHidden}
                    >
                      {index + 1}
                    </kbd>
                  );
                })}
              </span>

              <span className={styles.action}>
                {t("keyboardShortcuts.selectAnswer")}
              </span>
            </>
          )}
        </>
      )}

      {isAnswerReady && (
        <>
          <span className={styles.keys}>
            <kbd>N</kbd>
          </span>
          <span className={styles.action}>
            {t("keyboardShortcuts.nextQuestion")}
          </span>
        </>
      )}
    </div>
  );
}

export default KeyboardShortcuts;
