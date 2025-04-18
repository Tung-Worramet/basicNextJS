import { getCurrentUser } from "@/db/user";
import RegisterForm from "./RegisterForm";
import { redirect } from "next/navigation";

const RegisterPage = async () => {
  const user = await getCurrentUser();

  if (user) {
    redirect("/profile");
  }
  return (
    <div>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
