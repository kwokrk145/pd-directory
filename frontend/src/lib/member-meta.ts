import type { UserType } from "./types";

const accentClasses = [
  "bg-[#f4dfdc] text-[#a34a37]",
  "bg-[#d8f1df] text-[#2f6a48]",
  "bg-[#dfddfb] text-[#5646bf]",
  "bg-[#d9e3fb] text-[#3f5bb6]",
  "bg-[#faefbb] text-[#9a6512]",
  "bg-[#f2dff1] text-[#8e3b76]",
];

const stringToIndex = (value: string, max: number) => {
  let total = 0;
  for (let index = 0; index < value.length; index += 1) {
    total += value.charCodeAt(index);
  }
  return total % max;
};

export const getUserInitials = (user: Pick<UserType, "firstName" | "lastName">) =>
  `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();

export const getMemberMeta = (user: UserType) => {
  const key = `${user.firstName}-${user.lastName}-${user.email}`;
  const major = user.major?.trim() ?? "";
  const graduationYear = user.graduationYear?.trim() ?? "";
  const accentClass = accentClasses[stringToIndex(`${key}-accent`, accentClasses.length)];
  const spotlight = user.experiences?.[0];

  return {
    major,
    graduationYear,
    accentClass,
    spotlight,
    initials: getUserInitials(user),
  };
};
