import { Button } from "./Button.tsx";
import type { ComponentProps } from "react";

export function SizeButton({
  onSet,
  children,
  value,
  currentSize,
}: { value: number; onSet: () => void; currentSize: number } & ComponentProps<"button">) {
  const isSelected = currentSize === value;

  return (
    <Button className={isSelected ? "border-amber-500" : ""} onClick={onSet}>
      {children}
    </Button>
  );
}
