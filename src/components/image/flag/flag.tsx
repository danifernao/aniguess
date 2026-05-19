import Tooltip from "@components/tooltip/tooltip";
import { faCircleNotch, faFlag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isPlaceholder } from "@utils/placeholder-detector";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import styles from "./flag.module.css";

interface ImageFlagProps {
  src: string;
  newQuestion: () => void;
}

function ImageFlag({ src, newQuestion }: ImageFlagProps) {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(false);

  const flagImage = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const result = await isPlaceholder(src);

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
        className={`${styles.flag} button danger`}
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

export default ImageFlag;
