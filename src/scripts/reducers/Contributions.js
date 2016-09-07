import PromisedReducer  from "promised-reducer";
import axios            from "axios";
import { Seq }          from "immutable";

import { Contribution } from "../entities";

const key = "contributions";
const contributionsUrl = "https://s3-ap-northeast-1.amazonaws.com/kusa-store/20160825T075859508.json";

export default function (self, subscribe, initialState) {
  const reducer = new PromisedReducer(initialState);

  reducer.on(":update", state => self.setState({ [key]: state }));

  subscribe("Contributions:fetch", () => {
    reducer.update(() => axios.get(contributionsUrl)
      .then(res => Seq(res.data).map(c => new Contribution(c)).toList())
    );
  });
}

