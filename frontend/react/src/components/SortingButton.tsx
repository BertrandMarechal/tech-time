import { Button } from "./Button.tsx";
import type { SortingParameters } from "../store/todos-context.tsx";
import type { ComponentProps } from "react";

export function SortingButton({onSort, children, value, currentSorting}: {value: string; onSort: () => void; currentSorting: SortingParameters} & ComponentProps<"button">) {
  const isSortedOnThisValue = currentSorting.sort === value;

  let ascOrDesc = "";
  if (isSortedOnThisValue) {
    ascOrDesc = currentSorting.direction === "asc" ? "asc." : "desc.";
  }

  return (
    <Button className={isSortedOnThisValue ? "border" : ""} onClick={onSort}>{children}{ascOrDesc && ` (${ascOrDesc})`}</Button>
  );
}
