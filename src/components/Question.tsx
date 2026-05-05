import { useEffect, useMemo, useState } from "react";
import type { CharacterType } from "../types/types";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

interface QuestionProps {
  optionCharacters: CharacterType[];
  questionCharacter: CharacterType;
  checkAnswer: (char: CharacterType) => void;
}

function Question({
  optionCharacters,
  questionCharacter,
  checkAnswer,
}: QuestionProps) {
  const { t } = useTranslation();

  // Estado para controlar la carga de la imagen.
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);

  // Mezcla aleatoriamente el orden de los personajes.
  const shuffle = (arr: CharacterType[]): CharacterType[] => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j: number = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
  };

  // Memoriza el resultado de la mezcla para evitar recalcularlo en cada
  // renderizado.
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
          <FontAwesomeIcon icon={faCircleNotch} spin />
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
        <legend>{t("question.legend")}</legend>

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
              {character.media.nodes[0].title.english ||
                character.media.nodes[0].title.romaji}
            </label>
          </div>
        ))}
      </fieldset>
    </div>
  );
}

export default Question;
