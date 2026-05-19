import type { ScoreType, SettingsType } from "@/types/types";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faGear, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import SettingsRadioGroups from "./settings-radio-groups";
import SettingsResetStatsDialog from "./settings-reset-stats";
import styles from "./settings.module.css";

interface SettingsProps {
  settings: SettingsType;
  saveSettings: <K extends keyof SettingsType>(
    key: K,
    value: SettingsType[K],
    restart?: boolean,
  ) => void;
  score: ScoreType;
  resetScore: () => void;
}

function Settings({
  settings,
  saveSettings,
  score,
  resetScore,
}: SettingsProps) {
  const { t, i18n } = useTranslation();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const languageOptions = [
    { value: "es", label: t("settings.language.options.es") },
    { value: "en", label: t("settings.language.options.en") },
  ];

  const scorePercentage =
    score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <div className={styles.trigger}>
        <Dialog.Trigger asChild>
          <button
            type="button"
            title={t("settings.title")}
            aria-label={t("settings.title")}
            className="unstyled icon-link"
          >
            <FontAwesomeIcon icon={faGear} aria-hidden="true" />
          </button>
        </Dialog.Trigger>
      </div>

      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />

        <Dialog.Content className="dialog-content">
          <Dialog.Title className="dialog-title">
            {t("settings.title")}
          </Dialog.Title>

          <Dialog.Description className="dialog-description">
            {t("settings.description")}
          </Dialog.Description>

          <div className={styles.body}>
            {/* Opciones de configuración */}
            <div className={styles.content}>
              {/* Selector de idioma */}
              <div className={styles.item}>
                <h3 className={styles.itemTitle}>
                  {t("settings.language.title")}
                </h3>

                <div className={styles.itemContent}>
                  <select
                    value={i18n.language}
                    onChange={(event) => {
                      saveSettings(
                        "language",
                        event.target.value as SettingsType["language"],
                        false,
                      );
                    }}
                  >
                    {languageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grupos de opciones radio */}
              <SettingsRadioGroups
                settings={settings}
                saveSettings={saveSettings}
              />

              {/* Selector de idioma */}
              <div className={styles.item}>
                <h3 className={styles.itemTitle}>
                  {t("settings.soundEffects.title")}
                </h3>

                <div className={styles.itemContent}>
                  <div className={styles.option}>
                    <input
                      type="checkbox"
                      id="soundEffects"
                      checked={settings.enableSoundEffects}
                      onChange={(event) => {
                        saveSettings(
                          "enableSoundEffects",
                          event.target.checked,
                          false,
                        );
                      }}
                    />
                    <label htmlFor="soundEffects">
                      {t("settings.soundEffects.label")}
                    </label>
                  </div>
                </div>
              </div>

              {/* Reinicio de puntaje */}
              {score.total > 0 && (
                <div className={`${styles.item} ${styles.resetStats}`}>
                  <h3 className={styles.itemTitle}>
                    {t("settings.stats.title")}
                  </h3>

                  <div className={styles.itemContent}>
                    <SettingsResetStatsDialog resetScore={resetScore} />

                    <span className={styles.statsSummary}>
                      {t("settings.stats.summary", {
                        correct: score.correct,
                        total: score.total,
                        percentage: scorePercentage,
                      })}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Pie de la ventana modal */}
            <div className={styles.footer}>
              <div>
                <a
                  href={import.meta.env.VITE_APP_REPO}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={t("settings.footer.github")}
                  className="icon-link"
                >
                  <FontAwesomeIcon icon={faGithub} aria-hidden="true" />
                </a>
              </div>

              <div className={styles.right}>
                <Trans i18nKey="settings.footer.attribution">
                  <a
                    href="https://docs.anilist.co/"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                </Trans>{" "}
                | <span>v{__APP_VERSION__}</span>
              </div>
            </div>
          </div>

          <Dialog.Close asChild>
            <button
              type="button"
              title={t("common.close")}
              aria-label={t("common.close")}
              className="dialog-close unstyled icon-link"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Settings;
