import { useActionState, use } from "react";
import type { Todo } from "../models/todo.model";
import { TodosContext } from "../store/todos-context";
import { Button } from "./Button.tsx";

export function EditTodo({ todo, onCancel }: { todo: Todo; onCancel?: () => void }) {
  const { updateTodo } = use(TodosContext);

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
    updateTodo(todo.id, { content });
    return { errors };
  }

  const [formState, formAction] = useActionState(submitAction, { errors: {} });

  return (
    <form className="mt-4" action={formAction}>
      <p className="flex flex-row gap-2 items-center">
        <label htmlFor="content" className="text-xl">
          Edit task
        </label>
        <input id="content" type="text" name="content" className="p-2 border rounded" required defaultValue={todo ? todo.content : ""} />
        <Button>Update</Button>
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
