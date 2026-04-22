import type { Experience, UserType } from "./types";

const accentClasses = [
  "bg-[#f4dfdc] text-[#a34a37]",
  "bg-[#d8f1df] text-[#2f6a48]",
  "bg-[#dfddfb] text-[#5646bf]",
  "bg-[#d9e3fb] text-[#3f5bb6]",
  "bg-[#faefbb] text-[#9a6512]",
  "bg-[#f2dff1] text-[#8e3b76]",
];
const monthOrder = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
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

const getDateRank = (value: string, isEndDate: boolean) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return isEndDate ? -1 : 0;
  }

  if (trimmed === "Present") {
    return Number.MAX_SAFE_INTEGER;
  }

  const [month = "", year = ""] = trimmed.split(" ");
  const yearNumber = Number(year);
  const monthIndex = monthOrder.indexOf(month);

  if (!Number.isFinite(yearNumber)) {
    return isEndDate ? -1 : 0;
  }

  return yearNumber * 12 + Math.max(0, monthIndex);
};

export const sortExperiencesByRecency = (experiences: Experience[] = []) =>
  [...experiences].sort((left, right) => {
    const endDifference = getDateRank(right.endDate, true) - getDateRank(left.endDate, true);
    if (endDifference !== 0) {
      return endDifference;
    }

    const startDifference = getDateRank(right.startDate, false) - getDateRank(left.startDate, false);
    if (startDifference !== 0) {
      return startDifference;
    }

    return (right._creationTime ?? 0) - (left._creationTime ?? 0);
  });

export const getMemberMeta = (user: UserType) => {
  const key = `${user.firstName}-${user.lastName}-${user.email}`;
  const major = user.major?.trim() ?? "";
  const graduationYear = user.graduationYear?.trim() ?? "";
  const accentClass = accentClasses[stringToIndex(`${key}-accent`, accentClasses.length)];
  const spotlight = sortExperiencesByRecency(user.experiences ?? [])[0];

  return {
    major,
    graduationYear,
    accentClass,
    spotlight,
    initials: getUserInitials(user),
  };
};
