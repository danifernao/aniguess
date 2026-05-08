import Answer from "./components/Answer";
import Loading from "./components/Loading";
import Question from "./components/Question";
import Settings from "./components/Settings";
import { useCharacterQuiz } from "./hooks/useCharacterQuiz";
import Stats from "./components/Stats";

function App() {
  const answerOptionCount = 3;

  const {
    optionCharacters,
    questionCharacter,
    isAnswerCorrect,
    score,
    settings,
    errorFound,
    checkAnswer,
    newQuestion,
    resetScore,
    saveSettings,
  } = useCharacterQuiz(answerOptionCount);

  return (
    <div id="main">
      {!errorFound && questionCharacter && isAnswerCorrect === null && (
        <Question
          questionMode={settings.questionMode}
          optionCharacters={optionCharacters}
          questionCharacter={questionCharacter}
          checkAnswer={checkAnswer}
        />
      )}

      {!errorFound && questionCharacter && isAnswerCorrect !== null && (
        <Answer
          questionMode={settings.questionMode}
          questionCharacter={questionCharacter}
          isCorrect={isAnswerCorrect}
          newQuestion={newQuestion}
        />
      )}

      {(!questionCharacter || errorFound) && (
        <Loading errorFound={errorFound} />
      )}

      <Stats score={score} />

      <Settings
        settings={settings}
        saveSettings={saveSettings}
        score={score}
        resetScore={resetScore}
      />
    </div>
  );
}

export default App;
