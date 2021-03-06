import * as Rx from "rxjs";
import { filter } from "rxjs/operators";
import * as O from "../src/operators";
import { effect as T } from "@matechs/effect";

Rx.from([0, 1, 2, 3])
  .pipe(filter(n => n % 2 === 0))
  .pipe(
    O.chainEffect(n =>
      T.sync(() => {
        console.log(`persist ${n}`);
      })
    )
  );
