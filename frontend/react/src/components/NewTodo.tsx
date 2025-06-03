import { useActionState, use } from "react";
import type { Todo } from "../models/todo.model";
import { TodosContext } from "../store/todos-context";
import { Button } from "./Button.tsx";

export function NewTodo({ todo, onCancel, saveButtonLabel="Add" }: { saveButtonLabel?:string; todo?: Todo; onCancel?: () => void }) {
  const { addTodo, updateTodo } = use(TodosContext);

  async function submitAction(
    _: {
      errors: Record<string, string>;
      enteredValues?: { content: string };
    },
    formData: FormData
  ) {
    const content = formData.get("content") as string;
    const errors: { content?: string } = {};

    if (!content?.trim()) {
      errors.content = "Please provide a content";
    }
    if (todo) {
      updateTodo(todo.id, { content });
    } else {
      addTodo({ content });
    }
    return { errors };
  }

  const [formState, formAction] = useActionState(submitAction, { errors: {} });

  return (
    <form className="mt-4" action={formAction}>
      <p className="flex flex-row gap-2 items-center">
        <label htmlFor="content" className="text-xl">
          Content
        </label>
        <input id="content" type="text" name="content" className="border rounded" required defaultValue={todo ? todo.content : ""} />
        <Button>{saveButtonLabel}</Button>
        {onCancel && (
          <Button type="reset" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </p>
      {formState.errors.content && <p className="error">{formState.errors.content}</p>}
    </form>
  );
}
