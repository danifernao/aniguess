import { useMemo, useRef } from "react";
import type { CharacterType } from "../types/types";
import { useTranslation } from "react-i18next";
import { shuffle } from "../utils/shuffle";
import CharacterImage from "./CharacterImage";

interface QuestionProps {
  questionMode: "character" | "series";
  seriesTitleLanguage: "english" | "romaji";
  optionCharacters: CharacterType[];
  questionCharacter: CharacterType;
  checkAnswer: (char: CharacterType) => void;
}

function Question({
  questionMode,
  seriesTitleLanguage,
  optionCharacters,
  questionCharacter,
  checkAnswer,
}: QuestionProps) {
  const { t } = useTranslation();

  const isKeyboardAction = useRef(false);

  // Si no se usa teclado, valida la respuesta.
  const handleChange = (character: CharacterType) => {
    if (!isKeyboardAction.current) {
      checkAnswer(character);
    }

    isKeyboardAction.current = false;
  };

  // Si se usa teclado, valida la respuesta solo cuando se presiona Enter.
  const handleKeyDown = (e: React.KeyboardEvent, character: CharacterType) => {
    if (
      e.key === "ArrowUp" ||
      e.key === "ArrowDown" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight"
    ) {
      isKeyboardAction.current = true;
    }

    if (e.key === "Enter" || e.key === " ") {
      checkAnswer(character);
    }
  };

  const shuffledCharacters = useMemo(() => {
    return shuffle([...optionCharacters]);
  }, [optionCharacters]);

  return (
    <div id="question">
      <CharacterImage
        src={questionCharacter.image.large}
        alt={t("question.image_alt")}
        className="question-image"
      />

      <div className="question-block">
        <h2 className="question-title">
          {questionMode === "character"
            ? t("question.character")
            : t("question.series")}
        </h2>

        {shuffledCharacters.map((character: CharacterType) => (
          <div className="question-options" key={character.id}>
            <input
              type="radio"
              id={`media-${character.id}`}
              value={character.id}
              name="series-title"
              onChange={() => handleChange(character)}
              onKeyDown={(e) => handleKeyDown(e, character)}
            />
            <label htmlFor={`media-${character.id}`}>
              {questionMode === "character"
                ? character.name.full
                : seriesTitleLanguage === "english"
                  ? character.media.nodes[0].title.english ||
                    character.media.nodes[0].title.romaji
                  : character.media.nodes[0].title.romaji ||
                    character.media.nodes[0].title.english}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Question;
