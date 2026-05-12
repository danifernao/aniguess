import type { ScoreType, SettingsType } from "../types/types";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { useTranslation } from "react-i18next";
import SettingsRadioGroups from "./SettingsRadioGroups";
import * as Dialog from "@radix-ui/react-dialog";
import SettingsResetStatsDialog from "./SettingsResetStats";

interface SettingsProps {
  settings: SettingsType;
  saveSettings: (
    key: keyof SettingsType,
    value: string,
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
      <div id="settings-trigger">
        <Dialog.Trigger asChild>
          <button
            type="button"
            title={t("settings.title")}
            aria-label={t("settings.title")}
          >
            <FontAwesomeIcon icon={faGear} aria-hidden="true" />
          </button>
        </Dialog.Trigger>
      </div>

      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />

        <Dialog.Content id="settings" className="dialog-content">
          <Dialog.Title className="dialog-title">
            {t("settings.title")}
          </Dialog.Title>

          <div className="content">
            {/* Opciones de configuración */}
            <div className="controls">
              {/* Selector de idioma */}
              <fieldset>
                <legend>{t("settings.language.legend")}</legend>

                <div className="fields">
                  <select
                    value={i18n.language}
                    onChange={(event) => {
                      saveSettings("language", event.target.value, false);
                    }}
                    className="language"
                  >
                    {languageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </fieldset>

              {/* Grupos de opciones radio */}
              <SettingsRadioGroups
                settings={settings}
                saveSettings={saveSettings}
              />

              {/* Reinicio de puntaje */}
              {score.total > 0 && (
                <fieldset className="reset-stats">
                  <legend>{t("settings.stats.legend")}</legend>
                  <SettingsResetStatsDialog resetScore={resetScore} />
                  <span className="summary">
                    {t("stats.summary", {
                      correct: score.correct,
                      total: score.total,
                      percentage: scorePercentage,
                    })}
                  </span>
                </fieldset>
              )}
            </div>

            {/* Pie de la ventana modal */}
            <div className="footer">
              <a
                href="https://github.com/danifernao/aniguess"
                target="_blank"
                title={t("settings.footer.github")}
              >
                <FontAwesomeIcon icon={faGithub} aria-hidden="true" />
              </a>
            </div>
          </div>

          <Dialog.Close asChild>
            <button
              type="button"
              title={t("common.close")}
              aria-label={t("common.close")}
              className="dialog-close"
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
