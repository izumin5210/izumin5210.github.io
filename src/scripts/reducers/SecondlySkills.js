import PromisedReducer  from "promised-reducer";
import { Seq }          from "immutable";

import { SecondlySkill } from "../entities";

import initialSecondlySkills   from "../data/secondly_skills";

const key = "secondlySkills";

export default function (self, subscribe, initialState) {
  const reducer = new PromisedReducer(initialState);

  reducer.on(":update", state => self.setState({ [key]: state }));

  subscribe("SecondlySkills:fetch", () => {
    reducer.update(() =>
      Seq(initialSecondlySkills).map(s => new SecondlySkill(s)).toList()
    );
  });
}

