import PromisedReducer  from "promised-reducer";
import { Seq }          from "immutable";

import { PrimarySkill } from "../entities";

import initialPrimarySkills   from "../data/primary_skills";

const key = "primarySkills";

export default function (self, subscribe, initialState) {
  const reducer = new PromisedReducer(initialState);

  reducer.on(":update", state => self.setState({ [key]: state }));

  subscribe("PrimarySkills:fetch", () => {
    reducer.update(() =>
      Seq(initialPrimarySkills).map(s => new PrimarySkill(s)).toList()
    );
  });
}
