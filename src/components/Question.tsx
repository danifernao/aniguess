import { useEffect, useMemo, useState } from "react";
import type { CharacterType } from "../types/types";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { shuffle } from "../utils/shuffle";

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
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);

  const shuffledCharacters = useMemo(() => {
    return shuffle([...optionCharacters]);
  }, [optionCharacters]);

  useEffect(() => {
    setIsImageLoading(true);
  }, [questionCharacter]);

  return (
    <div id="question">
      {isImageLoading && (
        <div
          className="question-image-loading"
          aria-label={t("question.loading")}
          role="status"
        >
          <FontAwesomeIcon icon={faCircleNotch} spin aria-hidden="true" />
        </div>
      )}

      <img
        src={questionCharacter.image.large}
        alt={t("question.image_alt")}
        onLoad={() => setIsImageLoading(false)}
        onError={() => setIsImageLoading(false)}
        ref={(img) => {
          if (img && img.complete) {
            setIsImageLoading(false);
          }
        }}
        style={{
          display: isImageLoading ? "none" : "block",
        }}
        className="question-image character-image"
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
              onClick={() => checkAnswer(character)}
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
