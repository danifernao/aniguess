import type { ALCharType } from "../types/types";

interface RndCharQuestionProps {
  chars: ALCharType[];
  currChar: ALCharType;
  checkAnswer: (char: ALCharType) => void;
  transl: string;
}

function RndCharQuestion({
  chars,
  currChar,
  checkAnswer,
  transl,
}: RndCharQuestionProps) {
  const shuffle = (arr: ALCharType[]): ALCharType[] => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j: number = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  return (
    <div className="question">
      <img src={currChar.image.large} alt="" />
      <fieldset>
        <legend>{transl}</legend>
        {shuffle(chars).map((char: ALCharType, key: number) => (
          <div key={key}>
            <input
              type="radio"
              id={`media-${key}`}
              value={key}
              name="title"
              onClick={() => checkAnswer(char)}
            />
            <label htmlFor={`media-${key}`}>
              {char.media.nodes[0].title.english ||
                char.media.nodes[0].title.romaji}
            </label>
          </div>
        ))}
      </fieldset>
    </div>
  );
}

export default RndCharQuestion;
