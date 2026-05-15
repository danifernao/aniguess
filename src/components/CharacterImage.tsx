import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { useTranslation } from "react-i18next";
import Lightbox from "yet-another-react-lightbox";

interface CharacterImageProps {
  src: string;
  alt: string;
  className?: string;
}

function CharacterImage({ src, alt, className = "" }: CharacterImageProps) {
  const { t } = useTranslation();

  const [open, setOpen] = useState<boolean>(false);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);

  useEffect(() => {
    const img = new Image();

    img.src = src;

    img.onload = () => {
      setIsImageLoading(false);
    };

    img.onerror = () => {
      setIsImageLoading(false);
    };
  }, [src]);

  return (
    <>
      <div className="character-image" aria-busy={isImageLoading}>
        {isImageLoading && (
          <div
            className="character-image-loading"
            aria-label={t("characterImage.loading")}
            role="status"
          >
            <FontAwesomeIcon icon={faCircleNotch} spin aria-hidden="true" />
          </div>
        )}

        {!isImageLoading && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="character-image-button"
            title={t("characterImage.viewFullSize")}
            aria-label={t("characterImage.viewFullSize")}
          >
            <img
              src={src}
              alt={alt}
              className={`character-image-element ${className}`}
            />
          </button>
        )}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[{ src }]}
        plugins={[Zoom]}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2,
          scrollToZoom: true,
        }}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null,
        }}
        controller={{
          closeOnBackdropClick: true,
        }}
        labels={{
          Close: t("common.close"),
          "Zoom in": t("common.zoomIn"),
          "Zoom out": t("common.zoomOut"),
        }}
      />
    </>
  );
}

export default CharacterImage;
