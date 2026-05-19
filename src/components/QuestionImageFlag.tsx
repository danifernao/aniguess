import { faCircleNotch, faFlag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { CharacterType } from "../types/types";
import { isPlaceholder } from "../utils/placeholder-detector";
import Tooltip from "./Tooltip";

interface QuestionImageFlagProps {
  questionCharacter: CharacterType;
  newQuestion: () => void;
}

function QuestionImageFlag({
  questionCharacter,
  newQuestion,
}: QuestionImageFlagProps) {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(false);

  const flagImage = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const result = await isPlaceholder(questionCharacter.image.large);

      if (!result) {
        toast.info(t("questionImageFlag.notPlaceholder"));
        setHidden(true);
        return;
      }

      newQuestion();
    } catch (error) {
      if (import.meta.env.DEV) console.error(error);
      toast.error(t("questionImageFlag.analysisError"));
    } finally {
      setLoading(false);
    }
  };

  if (hidden) return;

  return (
    <Tooltip content={t("questionImageFlag.tooltip")}>
      <button
        onClick={flagImage}
        disabled={loading}
        className="question-image-flag button danger"
        aria-label={t("questionImageFlag.ariaLabel")}
        aria-busy={loading}
      >
        <FontAwesomeIcon
          icon={loading ? faCircleNotch : faFlag}
          spin={loading}
          aria-hidden="true"
        />
      </button>
    </Tooltip>
  );
}

export default QuestionImageFlag;
