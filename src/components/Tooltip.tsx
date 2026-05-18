import { ReactNode } from "react";
import TooltipDesktop from "./TooltipDesktop";
import TooltipMobile from "./TooltipMobile";

type TooltipProps = {
  content: string;
  children: ReactNode;
};

function Tooltip(props: TooltipProps) {
  const isMobile = window.matchMedia("(pointer: coarse)").matches;

  if (isMobile) {
    return <TooltipMobile {...props} />;
  }

  return <TooltipDesktop {...props} />;
}

export default Tooltip;
