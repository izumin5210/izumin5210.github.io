import PromisedReducer  from "promised-reducer";
import { Seq }          from "immutable";

import { Talk }     from "../entities";
import initialTalks from "../data/talks";

const key = "talks";

export default function (self, subscribe, initialState) {
  const reducer = new PromisedReducer(initialState);

  reducer.on(":update", state => self.setState({ [key]: state }));

  subscribe("PrimarySkills:fetch", () => {
    reducer.update(() =>
      Seq(initialTalks).map(s => new Talk(s)).toList()
    );
  });
}
