import * as Tooltip from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";

type TooltipDesktopProps = {
  content: string;
  children: ReactNode;
};

function TooltipDesktop({ content, children }: TooltipDesktopProps) {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>

        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            sideOffset={6}
            collisionPadding={8}
            className="tooltip-content"
          >
            {content}
            <Tooltip.Arrow className="tooltip-arrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

export default TooltipDesktop;
