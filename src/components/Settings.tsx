import type { ScoreType, SettingsType } from "../types/types";
import Modal from "react-modal";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { useTranslation } from "react-i18next";

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

type SettingGroup = {
  name: keyof SettingsType;
  options: {
    name: string;
    value: string;
  }[];
};

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

  const triggersNewQuestion = ["mediaType", "mediaNsfw"];
  const optionsWithNotices = ["mediaNsfw"];

  const settingGroups: SettingGroup[] = [
    {
      name: "questionMode",
      options: [
        {
          name: "character",
          value: "character",
        },
        {
          name: "series",
          value: "series",
        },
      ],
    },
    {
      name: "mediaType",
      options: [
        {
          name: "anime",
          value: "ANIME",
        },
        {
          name: "manga",
          value: "MANGA",
        },
        {
          name: "both",
          value: "NULL",
        },
      ],
    },
    {
      name: "mediaNsfw",
      options: [
        {
          name: "yes",
          value: "true",
        },
        {
          name: "no",
          value: "false",
        },
      ],
    },
  ];

  const normalizeSettingValue = (key: keyof SettingsType): string => {
    const value = settings[key];

    if (value === null) {
      return "NULL";
    }

    return String(value);
  };

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
          <div className="controls">
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

            {settingGroups.map((group, i) => (
              <fieldset key={i}>
                <legend>{t(`settings.${group.name}.legend`)}</legend>

                <div className="fields">
                  {group.options.map((option, j) => (
                    <div className="option" key={j}>
                      <input
                        type="radio"
                        id={`${group.name}-${j}`}
                        name={group.name}
                        value={option.value}
                        defaultChecked={
                          option.value === normalizeSettingValue(group.name)
                        }
                        onChange={(event) =>
                          saveSettings(
                            group.name,
                            event.currentTarget.value,
                            triggersNewQuestion.includes(group.name),
                          )
                        }
                      />
                      <label htmlFor={`${group.name}-${j}`}>
                        {t(`settings.${group.name}.options.${option.name}`)}
                      </label>
                    </div>
                  ))}
                </div>

                {optionsWithNotices.includes(group.name) && (
                  <div className="option-notice">
                    <p>{t(`settings.${group.name}.notice`)}</p>
                  </div>
                )}
              </fieldset>
            ))}

            {score.total > 0 && (
              <fieldset className="reset-stats">
                <legend>{t("settings.stats.legend")}</legend>
                <button className="action" onClick={() => reset()}>
                  {t("settings.stats.button")}
                </button>
                <span className="score">
                  {`${t("score.correct", { count: score.correct })} ${t("common.of")} ${t("score.question", { count: score.total })}.`}
                </span>
              </fieldset>
            )}
          </div>

          <div className="footer">
            <a
              href="https://github.com/danifernao/aniguess"
              target="_blank"
              title={t("settings.footer.github")}
            >
              <FontAwesomeIcon icon={faGithub} aria-hidden="true" />
            </a>

            <p className="notice">{t("settings.footer.notice")}</p>
          </div>
        </div>

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
