import type { CharacterType } from "../types/types";
import { useTranslation } from "react-i18next";

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

  // Mezcla aleatoriamente el orden de los personajes.
  const shuffle = (arr: CharacterType[]): CharacterType[] => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j: number = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
  };

  return (
    <div className="question">
      <img src={questionCharacter.image.large} alt="" />

      <fieldset>
        <legend>{t("question.legend")}</legend>

        {shuffle(optionCharacters).map(
          (character: CharacterType, key: number) => (
            <div key={key}>
              <input
                type="radio"
                id={`media-${key}`}
                value={key}
                name="title"
                onClick={() => checkAnswer(character)}
              />
              <label htmlFor={`media-${key}`}>
                {character.media.nodes[0].title.english ||
                  character.media.nodes[0].title.romaji}
              </label>
            </div>
          ),
        )}
      </fieldset>
    </div>
  );
}

export default Question;
