import type { ScoreType, SettingsType } from "../types/types";
import Modal from "react-modal";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { useTranslation } from "react-i18next";
import SettingsRadioGroups from "./SettingsRadioGroups";

Modal.setAppElement("#root");

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

  const reset = () => {
    const confirmation = confirm(t("settings.stats.confirm"));

    if (confirmation) {
      resetScore();
    }
  };

  return (
    <>
      <div className="settings-trigger">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          title={t("settings.title")}
          aria-label={t("settings.title")}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls="settings-modal"
        >
          <FontAwesomeIcon icon={faGear} aria-hidden="true" />
        </button>
      </div>

      {/* Ventana modal */}
      <Modal
        id="settings"
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        overlayClassName="overlay"
        contentLabel={t("settings.title")}
        className="modal"
      >
        <h2 className="title">{t("settings.title")}</h2>

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
                <button className="action" onClick={() => reset()}>
                  {t("settings.stats.button")}
                </button>
                <span className="summary">
                  {t("score.summary", {
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

        {/* Botón para cerrar ventana modal */}
        <button
          className="modal-close"
          onClick={() => setIsOpen(false)}
          title={t("settings.close")}
          aria-label={t("settings.close")}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </Modal>
    </>
  );
}

export default Settings;
