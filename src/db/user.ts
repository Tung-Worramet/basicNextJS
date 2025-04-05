interface RegisterInput {
  name?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const register = async (input: RegisterInput) => {};
