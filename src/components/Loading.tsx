import { useTranslation } from "react-i18next";

interface LoadingProps {
  errorFound: boolean;
}

function Loading({ errorFound }: LoadingProps) {
  const { t } = useTranslation();

  return (
    <div className={`loading ${errorFound ? "error" : ""}`}>
      {errorFound ? (
        <p>{t("loading.error")}</p>
      ) : (
        <>
          <p>{t("loading.intro")}</p>
          <p>{t("loading.delay")}</p>
        </>
      )}
    </div>
  );
}

export default Loading;
