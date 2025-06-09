import { type ComponentProps } from "react";

export function Button({ children, disabled, className, ...props }: ComponentProps<"button">) {
  const classesBasedOnDisabled = disabled ? "cursor-not-allowed opacity-30" : "cursor-pointer text-amber-500 hover:border-amber-300 hover:text-amber-300";
  const classNameExtended = ` border-1 rounded-md px-4 border-amber-200 ${classesBasedOnDisabled} ${className || ""}`

  return <button disabled={disabled} className={classNameExtended} {...props}>{children}</button>;
}
