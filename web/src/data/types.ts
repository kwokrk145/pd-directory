export type RegisterInfo = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export type RegisterResponse = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

export type LoginInfo = {
    email: string;
    password: string;
}

export type UserType = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  experiences?: Experience[];
};

export type Experience = {
    id: number;
    title: string;
    organization: string;
    startDate: string;
    endDate: string;
    description?: string;
}