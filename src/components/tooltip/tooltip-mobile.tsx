import * as Popover from "@radix-ui/react-popover";
import {
  cloneElement,
  isValidElement,
  useId,
  useRef,
  useState,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import styles from "./tooltip.module.css";

type TooltipMobileProps = {
  content: string;
  children: ReactNode;
};

export default function TooltipMobile({
  content,
  children,
}: TooltipMobileProps) {
  const [open, setOpen] = useState(false);

  const tooltipId = useId();

  // Referencia usada para almacenar el temporizador del toque presionado.
  const timerRef = useRef<number | null>(null);

  // Referencia que indica si el toque presionado ya fue activado.
  const longPressTriggeredRef = useRef(false);

  // Si el usuario mantiene presionado el tiempo suficiente se abre el Popover.
  const handlePointerDown = () => {
    longPressTriggeredRef.current = false;

    timerRef.current = window.setTimeout(() => {
      longPressTriggeredRef.current = true;

      setOpen(true);
    }, 500);
  };

  // Cancela el temporizador cuando el usuario deja de presionar
  // o abandona el elemento.
  const clearPressTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);

      timerRef.current = null;
    }
  };

  // Bloquea el clic normal únicamente si el toque presionado abrió el Popover.
  const handleClick = (e: PointerEvent | React.MouseEvent) => {
    if (longPressTriggeredRef.current) {
      e.preventDefault();
      e.stopPropagation();
      longPressTriggeredRef.current = false;
    }
  };

  // Verifica que el hijo sea un elemento React válido antes de clonarlo.
  if (!isValidElement(children)) {
    return children;
  }

  // Clona el hijo para fusionar sus eventos originales
  // con la lógica del toque presionado.
  const child = children as ReactElement<React.HTMLAttributes<Element>>;

  const childWithHandlers = cloneElement(child, {
    "aria-describedby": tooltipId,

    onPointerDown: (e: React.PointerEvent) => {
      child.props.onPointerDown?.(e);
      handlePointerDown();
    },
    onPointerUp: (e: React.PointerEvent) => {
      child.props.onPointerUp?.(e);
      clearPressTimer();
    },
    onPointerLeave: (e: React.PointerEvent) => {
      child.props.onPointerLeave?.(e);
      clearPressTimer();
    },
    onPointerCancel: (e: React.PointerEvent) => {
      child.props.onPointerCancel?.(e);
      clearPressTimer();
    },
    onClick: (e: React.MouseEvent) => {
      child.props.onClick?.(e);
      handleClick(e);
    },
    style: {
      touchAction: "manipulation",
      WebkitTouchCallout: "none",
      userSelect: "none",
      ...(child.props.style ?? {}),
    },
  });

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Anchor asChild>{childWithHandlers}</Popover.Anchor>
      <Popover.Portal forceMount>
        <Popover.Content
          id={tooltipId}
          side="top"
          sideOffset={6}
          collisionPadding={8}
          className={styles.content}
          role="tooltip"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          style={{ display: open ? undefined : "none" }}
        >
          {content}
          <Popover.Arrow className={styles.arrow} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
