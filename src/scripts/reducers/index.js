import contributionsReducer   from "./Contributions";
import primarySkillsReducer   from "./PrimarySkills";
import secondlySkillsReducer  from "./SecondlySkills";

import { store } from "../entities";

export default function (self, subscribe) {
  contributionsReducer(self, subscribe, store.contributions);
  primarySkillsReducer(self, subscribe, store.primarySkills);
  secondlySkillsReducer(self, subscribe, store.secondlySkills);
}

