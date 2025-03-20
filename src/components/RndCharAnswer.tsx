interface Char {
  name?: {
    full: string;
  };
  image?: {
    large: string;
  };
  media?: {
    nodes: [
      {
        title: {
          english: string;
          romaji: string;
        };
        siteUrl?: string;
      }
    ];
  };
  siteUrl?: string;
}

interface RndCharAnswerProps {
  currChar: Char;
  isCorrect: boolean;
  playAgain: () => void;
  transl: {
    correct: string;
    incorrect: string;
    next: string;
  };
}

function RndCharAnswer({
  currChar,
  isCorrect,
  playAgain,
  transl,
}: RndCharAnswerProps) {
  return (
    <div className={`answer ${isCorrect ? "correct" : "incorrect"}`}>
      <div>
        <p className="title">
          <b>{isCorrect ? transl.correct : transl.incorrect}</b>
        </p>
        <img src={currChar.image!.large} alt="" />
        <div className="description">
          <p>
            <a href={currChar.siteUrl} target="_blank">
              {currChar.name!.full}
            </a>
          </p>
          <p>
            <a href={currChar.media!.nodes[0].siteUrl} target="_blank">
              {currChar.media!.nodes[0].title.english ||
                currChar.media!.nodes[0].title.romaji}
            </a>
          </p>
        </div>
      </div>
      <button onClick={playAgain}>{transl.next}</button>
    </div>
  );
}

export default RndCharAnswer;
