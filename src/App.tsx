import Answer from "./components/Answer";
import Loading from "./components/Loading";
import Question from "./components/Question";
import Settings from "./components/Settings";
import { useCharacterQuiz } from "./hooks/useCharacterQuiz";
import Stats from "./components/Stats";
import { Toaster } from "sonner";
import Error from "./components/Error";
import { useEffect } from "react";
import KeyboardShortcuts from "./components/KeyboardShortcuts";

function App() {
  const answerOptionCount = 3;

  const {
    optionCharacters,
    questionCharacter,
    isHintAvailable,
    isAnswerCorrect,
    score,
    settings,
    errorContext,
    setHintAvailability,
    checkAnswer,
    newQuestion,
    resetScore,
    saveSettings,
    resumeFlow,
  } = useCharacterQuiz(answerOptionCount);

  // Determina el estado actual del juego.
  const hasQuestion = questionCharacter !== null;
  const isQuestionReady = hasQuestion && isAnswerCorrect === null;
  const isAnswerReady = hasQuestion && isAnswerCorrect !== null;
  const isLoading = !questionCharacter;

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
    <div className="wrapper">
      {!errorContext && (
        <>
          <Stats score={score} />

          <main className="main" aria-live="polite" aria-busy={isLoading}>
            {isQuestionReady && (
              <Question
                questionMode={settings.questionMode}
                seriesTitleLanguage={settings.seriesTitleLanguage}
                optionCharacters={optionCharacters}
                questionCharacter={questionCharacter}
                isHintAvailable={isHintAvailable}
                setHintAvailability={setHintAvailability}
                checkAnswer={checkAnswer}
              />
            )}

            {isAnswerReady && (
              <Answer
                questionMode={settings.questionMode}
                seriesTitleLanguage={settings.seriesTitleLanguage}
                questionCharacter={questionCharacter}
                isCorrect={isAnswerCorrect}
                newQuestion={newQuestion}
              />
            )}

            {isLoading && <Loading />}
          </main>

          <footer className="footer">
            <Settings
              settings={settings}
              saveSettings={saveSettings}
              score={score}
              resetScore={resetScore}
            />
            <KeyboardShortcuts
              isQuestionReady={isQuestionReady}
              isAnswerReady={isAnswerReady}
              isHintAvailable={isHintAvailable}
              totalOptions={answerOptionCount}
            />
          </footer>
        </>
      )}

      {errorContext && <Error resume={resumeFlow} />}

      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
