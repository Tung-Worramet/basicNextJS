"use client";

import Form from "next/form";
import { getName } from "./action";
import { useActionState, useEffect } from "react";

const FormComp = () => {
  const [state, formAction, isPending] = useActionState(getName, null);

  useEffect(() => {
    if (state) {
      alert(state);
    }
  }, [state]);

  return (
    <Form action={formAction}>
      <input type="text" name="name" />
      <button type="submit">{isPending ? "Submitting..." : "Submit"}</button>
    </Form>
  );
};
export default FormComp;
