interface Char {
  id?: number;
  name?: {
    full: string;
  };
  image?: {
    large: string;
  };
  media?: {
    nodes: [
      {
        id: number;
        title: {
          english: string;
          romaji: string;
        };
        siteUrl: string;
      }
    ];
  };
  siteUrl?: string;
}

interface RndCharQuestionProps {
  chars: Char[];
  currChar: Char;
  checkAnswer: (char: Char) => void;
  transl: string;
}

function RndCharQuestion({
  chars,
  currChar,
  checkAnswer,
  transl,
}: RndCharQuestionProps) {
  const shuffle = (arr: Char[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j: number = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  return (
    <div className="question">
      <img src={currChar.image!.large} alt="" />
      <fieldset>
        <legend>{transl}</legend>
        {shuffle(chars).map((char: Char, key: number) => (
          <div key={key}>
            <input
              type="radio"
              id={`media-${key}`}
              value={key}
              name="title"
              onClick={() => checkAnswer(char)}
            />
            <label htmlFor={`media-${key}`}>
              {char.media!.nodes[0].title.english ||
                char.media!.nodes[0].title.romaji}
            </label>
          </div>
        ))}
      </fieldset>
    </div>
  );
}

export default RndCharQuestion;
