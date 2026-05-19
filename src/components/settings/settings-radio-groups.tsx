import type { SettingsType } from "@/types/types";
import { useTranslation } from "react-i18next";
import styles from "./settings.module.css";

interface SettingsRadioGroupsProps {
  settings: SettingsType;
  saveSettings: (
    key: keyof SettingsType,
    value: string,
    restart?: boolean,
  ) => void;
}

type radioGroup = {
  name: keyof SettingsType;
  options: {
    name: string;
    value: string;
  }[];
};

function SettingsRadioGroups({
  settings,
  saveSettings,
}: SettingsRadioGroupsProps) {
  const { t } = useTranslation();

  const triggersNewQuestion = ["mediaType", "includeAdultMedia"];

  const radioGroups: radioGroup[] = [
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
      name: "seriesTitleLanguage",
      options: [
        {
          name: "english",
          value: "english",
        },
        {
          name: "romaji",
          value: "romaji",
        },
      ],
    },
    {
      name: "includeAdultMedia",
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

  return radioGroups.map((group, i) => (
    <div className={styles.item} key={i}>
      <h3 className={styles.itemTitle}>{t(`settings.${group.name}.title`)}</h3>

      <div className={styles.itemContent}>
        {group.options.map((option, j) => (
          <div className={styles.option} key={j}>
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
    </div>
  ));
}

export default SettingsRadioGroups;
