import type { AppSettingsType, TranslSettingsType } from "../types/types";
import Modal from "react-modal";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faXmark } from "@fortawesome/free-solid-svg-icons";

Modal.setAppElement("#root");

interface RndCharSettingsProps {
  settings: AppSettingsType;
  saveSettings: (key: string, value: string) => void;
  transl: TranslSettingsType;
}

function RndCharSettings({
  settings,
  saveSettings,
  transl,
}: RndCharSettingsProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const inputGroups = [
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

  const toggleModal = (
    event: React.MouseEvent<HTMLAnchorElement> | null = null
  ): void => {
    setIsOpen((open) => (open ? false : true));
    if (event) {
      event.preventDefault();
    }
  };

  const toString = (name: string): string => {
    if (name === "mediaType") {
      return settings.mediaType === null ? "NULL" : settings.mediaType;
    } else {
      return settings.mediaNsfw.toString();
    }
  };

  return (
    <>
      <div className="settings">
        <a
          href="#"
          onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) =>
            toggleModal(e)
          }
          title={transl.title}
          aria-label={transl.title}
        >
          <FontAwesomeIcon icon={faGear} />
        </a>
      </div>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => toggleModal()}
        className="modal"
        overlayClassName="overlay"
        contentLabel={transl.title}
      >
        <h2>{transl.title}</h2>
        <div className="content">
          {inputGroups.map((group, i) => (
            <fieldset key={i}>
              <legend>{transl[group.name as keyof object]["legend"]}</legend>
              <div className="options">
                {group.options.map((option, j) => (
                  <div key={j}>
                    <input
                      type="radio"
                      id={`${group.name}-${j}`}
                      name={group.name}
                      value={option.value}
                      defaultChecked={option.value === toString(group.name)}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        saveSettings(group.name, event.currentTarget.value)
                      }
                    />
                    <label htmlFor={`${group.name}-${j}`}>
                      {
                        transl[group.name as keyof object]["options"][
                          option.name
                        ]
                      }
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
          ))}
          <p className="note">{transl.note}</p>
        </div>
        <button
          className="close"
          onClick={() => toggleModal()}
          title={transl.close}
          aria-label={transl.close}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </Modal>
    </>
  );
}

export default RndCharSettings;
