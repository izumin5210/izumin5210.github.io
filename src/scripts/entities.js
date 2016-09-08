import { Record, List } from "immutable";
import moment           from "moment";

export const Contribution = Record({ count: 0, date: new Date("1970-01-01") });
export const Contributions = List;
export const PrimarySkill = Record({ name: "", score: 0 });
export const PrimarySkills = List;
export const SecondlySkill = Record({ name: "" });
export const SecondlySkills = List;
export const Event = Record({ name: "", url: "" });

const talkSpec = {
  title: "",
  url: "",
  event: new Event(),
  talkedOn: new Date("1970-01-01"),
};
export class Talk extends Record(talkSpec) {
  get talkedOn() {
    return moment(super.talkedOn);
  }
}
export const Talks = List;

export const store = {
  contributions: new Contributions(),
  primarySkills: new PrimarySkills(),
  secondlySkills: new SecondlySkills(),
  talks: new Talks(),
};
