import type { AppScoreType, TranslScoreType } from "../types/types";

interface RndCharScoreProps {
  score: AppScoreType;
  transl: TranslScoreType;
}

function RndCharScore({ score, transl }: RndCharScoreProps) {
  const getPercentage = (): number => {
    return score.total > 0
      ? Math.trunc((score.correct / score.total) * 100)
      : 0;
  };

  return (
    <dl className="score">
      <dt>{transl.correct}</dt>
      <dd>{score.correct}</dd>
      <dt>{transl.total}</dt>
      <dd>{score.total}</dd>
      <dt>{transl.percentage}</dt>
      <dd>{getPercentage()}%</dd>
    </dl>
  );
}

export default RndCharScore;
