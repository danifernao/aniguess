import { useEffect } from "react";
import { Toaster } from "sonner";
import Answer from "./components/answer/answer";
import Error from "./components/error/error";
import Loading from "./components/loading/loading";
import Question from "./components/question/question";
import Settings from "./components/settings/settings";
import KeyboardShortcuts from "./components/shortcuts/shortcuts";
import Stats from "./components/stats/stats/stats";
import { useCharacterQuiz } from "./hooks/useCharacterQuiz";

function App() {
  const answerOptionCount = 3;

  const {
    questionCharacter,
    answerOptions,
    hiddenOptionIds,
    isHintAvailable,
    isAnswerCorrect,
    score,
    settings,
    errorContext,
    setHintAvailability,
    triggerHint,
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
                questionCharacter={questionCharacter}
                answerOptions={answerOptions}
                hiddenOptionIds={hiddenOptionIds}
                isHintAvailable={isHintAvailable}
                seriesTitleLanguage={settings.seriesTitleLanguage}
                setHintAvailability={setHintAvailability}
                triggerHint={triggerHint}
                checkAnswer={checkAnswer}
                newQuestion={newQuestion}
              />
            )}

            {isAnswerReady && (
              <Answer
                questionMode={settings.questionMode}
                questionCharacter={questionCharacter}
                isCorrect={isAnswerCorrect}
                newQuestion={newQuestion}
                seriesTitleLanguage={settings.seriesTitleLanguage}
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
              answerOptions={answerOptions}
              hiddenOptionIds={hiddenOptionIds}
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
