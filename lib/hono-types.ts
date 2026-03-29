export type SafeUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export type AppVariables = {
  user: SafeUser;
};
