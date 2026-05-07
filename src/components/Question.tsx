import { useEffect, useMemo, useState } from "react";
import type { CharacterType } from "../types/types";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { shuffle } from "../utils/shuffle";

interface QuestionProps {
  questionMode: "character" | "series";
  optionCharacters: CharacterType[];
  questionCharacter: CharacterType;
  checkAnswer: (char: CharacterType) => void;
}

function Question({
  questionMode,
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
    <div className="question">
      {isImageLoading && (
        <div
          className="loading-image"
          aria-label={t("question.loading")}
          role="status"
        >
          <FontAwesomeIcon icon={faCircleNotch} spin aria-hidden="true" />
        </div>
      )}

      <img
        src={questionCharacter.image.large}
        alt=""
        onLoad={() => setIsImageLoading(false)}
        onError={() => setIsImageLoading(false)}
        style={{
          display: isImageLoading ? "none" : "block",
        }}
      />

      <fieldset>
        <legend>
          {questionMode === "character"
            ? t("question.character")
            : t("question.series")}
        </legend>

        {shuffledCharacters.map((character: CharacterType) => (
          <div key={character.id}>
            <input
              type="radio"
              id={`media-${character.id}`}
              value={character.id}
              name="title"
              onClick={() => checkAnswer(character)}
            />
            <label htmlFor={`media-${character.id}`}>
              {questionMode === "character"
                ? character.name.full
                : character.media.nodes[0].title.english ||
                  character.media.nodes[0].title.romaji}
            </label>
          </div>
        ))}
      </fieldset>
    </div>
  );
}

export default Question;
