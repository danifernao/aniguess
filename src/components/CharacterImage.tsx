import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useTranslation } from "react-i18next";

interface CharacterImageProps {
  src: string;
  alt: string;
  className?: string;
}

function CharacterImage({ src, alt, className = "" }: CharacterImageProps) {
  const { t } = useTranslation();

  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsImageLoading(true);
  }, [src]);

  return (
    <>
      {isImageLoading && (
        <div
          className="character-image-loading"
          aria-label={t("characterImage.loading")}
          role="status"
        >
          <FontAwesomeIcon icon={faCircleNotch} spin aria-hidden="true" />
        </div>
      )}

      <Zoom>
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsImageLoading(false)}
          onError={() => setIsImageLoading(false)}
          ref={(img) => {
            if (img && img.complete) {
              setIsImageLoading(false);
            }
          }}
          style={{
            display: isImageLoading ? "none" : "block",
          }}
          className={`character-image ${className}`}
        />
      </Zoom>
    </>
  );
}

export default CharacterImage;
