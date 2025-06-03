import { type ComponentProps } from "react";

export function Button({ children, disabled, className, ...props }: ComponentProps<"button">) {
  const classesBasedOnDisabled = disabled ? "cursor-not-allowed text-stone-400" : "cursor-pointer text-stone-600 hover:bg-stone-300 hover:text-stone-700";
  const classNameExtended = `rounded-xl px-4 py-1 bg-stone-200 ${classesBasedOnDisabled} ${className || ""}`

  return <button disabled={disabled} className={classNameExtended} {...props}>{children}</button>;
}
