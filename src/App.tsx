import Answer from "./components/Answer";
import Loading from "./components/Loading";
import Question from "./components/Question";
import Settings from "./components/Settings";
import { useCharacterQuiz } from "./hooks/useCharacterQuiz";
import Stats from "./components/Stats";
import { Toaster } from "sonner";
import Error from "./components/Error";

function App() {
  const answerOptionCount = 3;

  const {
    optionCharacters,
    questionCharacter,
    isAnswerCorrect,
    score,
    settings,
    errorContext,
    checkAnswer,
    newQuestion,
    resetScore,
    saveSettings,
    resumeFlow,
  } = useCharacterQuiz(answerOptionCount);

  return (
    <div id="main">
      {!errorContext && (
        <>
          {questionCharacter && isAnswerCorrect === null && (
            <Question
              questionMode={settings.questionMode}
              seriesTitleLanguage={settings.seriesTitleLanguage}
              optionCharacters={optionCharacters}
              questionCharacter={questionCharacter}
              checkAnswer={checkAnswer}
            />
          )}

          {questionCharacter && isAnswerCorrect !== null && (
            <Answer
              questionMode={settings.questionMode}
              seriesTitleLanguage={settings.seriesTitleLanguage}
              questionCharacter={questionCharacter}
              isCorrect={isAnswerCorrect}
              newQuestion={newQuestion}
            />
          )}

          {!questionCharacter && <Loading />}

          <Stats score={score} />

          <Settings
            settings={settings}
            saveSettings={saveSettings}
            score={score}
            resetScore={resetScore}
          />
        </>
      )}

      {errorContext && <Error resume={resumeFlow} />}

      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
