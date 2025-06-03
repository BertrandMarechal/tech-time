import { type ComponentProps } from "react";

export function Button({ children, className, ...props }: ComponentProps<"button">) {
  const classNameExtended = `cursor-pointer rounded-xl px-4 py-1 bg-stone-200 hover:bg-stone-300 text-stone-600 hover:text-stone-700 ${className || ""}`
  return <button className={classNameExtended} {...props}>{children}</button>;
}
