import Answer from "./components/Answer";
import Loading from "./components/Loading";
import Question from "./components/Question";
import Settings from "./components/Settings";
import { useCharacterQuiz } from "./hooks/useCharacterQuiz";
import Stats from "./components/Stats";
import { Toaster } from "sonner";
import Error from "./components/Error";
import { useEffect } from "react";

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

  // Desactiva el menú contextual (clic derecho) en producción.
  useEffect(() => {
    if (!import.meta.env.PROD) {
      return;
    }

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    document.body.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.body.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <div id="main">
      {!errorContext && (
        <>
          <Stats score={score} />

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
