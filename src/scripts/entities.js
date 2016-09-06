import { Record, List } from "immutable";

export const Contribution = Record({ count: 0, date: new Date("1970-01-01") });
export const Contributions = List;
export const PrimarySkill = Record({ name: "", score: 0 });
export const PrimarySkills = List;
export const SecondlySkill = Record({ name: "" });
export const SecondlySkills = List;

export const store = {
  contributions: new Contributions(),
  primarySkills: new PrimarySkills(),
  secondlySkills: new SecondlySkills(),
};
