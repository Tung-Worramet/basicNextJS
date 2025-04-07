import { getCurrentUser } from "@/db/user";
import LoginForm from "./LoginForm";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const user = await getCurrentUser();

  if (user) {
    redirect("/profile");
  }

  return (
    <div>
      <LoginForm />
    </div>
  );
};
export default LoginPage;
