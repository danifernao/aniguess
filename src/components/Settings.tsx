import type { SettingsType } from "../types/types";
import Modal from "react-modal";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

Modal.setAppElement("#root");

interface SettingsProps {
  settings: SettingsType;
  saveSettings: (key: keyof SettingsType, value: string) => void;
}

type SettingGroup = {
  name: keyof SettingsType;
  options: {
    name: string;
    value: string;
  }[];
};

function Settings({ settings, saveSettings }: SettingsProps) {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const languageOptions = [
    { value: "es", label: t("language.options.es") },
    { value: "en", label: t("language.options.en") },
  ];

  const settingGroups: SettingGroup[] = [
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

  return (
    <>
      <div className="settings">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          title={t("settings.title")}
          aria-label={t("settings.title")}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls="settings-modal"
        >
          <FontAwesomeIcon icon={faGear} />
        </button>
      </div>

      <Modal
        id="settings-modal"
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        className="modal"
        overlayClassName="overlay"
        contentLabel={t("settings.title")}
      >
        <h2>{t("settings.title")}</h2>

        <div className="content">
          <fieldset>
            <legend>{t("language.legend")}</legend>

            <div className="options">
              <select
                value={i18n.language}
                onChange={(event) => {
                  saveSettings("language", event.target.value);
                }}
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

              <div className="options">
                {group.options.map((option, j) => (
                  <div key={j}>
                    <input
                      type="radio"
                      id={`${group.name}-${j}`}
                      name={group.name}
                      value={option.value}
                      defaultChecked={
                        option.value === normalizeSettingValue(group.name)
                      }
                      onChange={(event) =>
                        saveSettings(group.name, event.currentTarget.value)
                      }
                    />
                    <label htmlFor={`${group.name}-${j}`}>
                      {t(`settings.${group.name}.options.${option.name}`)}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
          ))}
          <p className="note">{t("settings.note")}</p>
        </div>

        <button
          className="close"
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
