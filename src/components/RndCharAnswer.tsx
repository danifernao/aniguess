import type { ALCharType, TranslAnswerType } from "../types/types";

interface RndCharAnswerProps {
  currChar: ALCharType;
  isCorrect: boolean;
  playAgain: () => void;
  transl: TranslAnswerType;
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
        <img src={currChar.image.large} alt="" />
        <div className="description">
          <p>
            <a href={currChar.siteUrl} target="_blank">
              {currChar.name!.full}
            </a>
          </p>
          <p>
            <a href={currChar.media.nodes[0].siteUrl} target="_blank">
              {currChar.media.nodes[0].title.english ||
                currChar.media.nodes[0].title.romaji}
            </a>
          </p>
        </div>
      </div>
      <button onClick={playAgain}>{transl.next}</button>
    </div>
  );
}

export default RndCharAnswer;
