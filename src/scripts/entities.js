import { Record, List } from "immutable";

export const Contribution = Record({ count: 0, date: new Date("1970-01-01") });
export const Contributions = List;
export const store = {
  contributions: new Contributions(),
};
