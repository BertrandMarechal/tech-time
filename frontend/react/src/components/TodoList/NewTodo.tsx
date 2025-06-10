import { use, useActionState, useState } from "react";
import { TodosContext } from "../../store/todos-context.tsx";
import { Button } from "../Button.tsx";

export function NewTodo() {
  const { addTodo } = use(TodosContext);
  const [showForm, setShowForm] = useState(false);
  function handleShow() {
    setShowForm(true);
  }
  function handleCancel() {
    setShowForm(false);
  }


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
    addTodo({ content });
    return { errors };
  }

  const [formState, formAction] = useActionState(submitAction, { errors: {} });

  if (!showForm) {
    return (
      <Button onClick={handleShow}>+ Add</Button>
    );
  }

  return (
    <form className="mt-4" action={formAction}>
      <p className="flex flex-row gap-2 items-center">
        <label htmlFor="content" className="text-xl">
          New Task
        </label>
        <input id="content" type="text" name="content" className="p-2 border rounded" required />
        <Button>Add</Button>
        <Button type="reset" onClick={handleCancel}>
          Cancel
        </Button>
      </p>
      {formState.errors.content && <p className="error">{formState.errors.content}</p>}
    </form>
  );
}
