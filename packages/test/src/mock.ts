import { freeEnv as F, effect as T } from "@matechs/effect";
import { FunctionN } from "fp-ts/lib/function";

export type EnvOf<F> = F extends FunctionN<infer _ARG, T.Effect<infer R, infer _E, infer _A>>
  ? R
  : F extends T.Effect<infer R, infer _E, infer _A>
  ? R
  : never;

export type OnlyNew<M extends F.ModuleShape<any>, I extends Implementation<M>> = {
  [k in keyof I]: {
    [h in keyof I[k]]: I[k][h] extends FunctionN<
      infer ARG,
      T.Effect<infer R & EnvOf<M[k][h]>, infer E, infer A>
    >
      ? FunctionN<ARG, T.Effect<R, E, A>>
      : I[k][h] extends T.Effect<infer R & EnvOf<M[k][h]>, infer E, infer A>
      ? T.Effect<R, E, A>
      : never;
  };
};

export type Implementation<M> = {
  [k in keyof M]: {
    [h in keyof M[k]]?: M[k][h] extends FunctionN<infer ARG, T.Effect<infer _R, infer E, infer A>>
      ? FunctionN<ARG, T.Effect<any, E, A>>
      : M[k][h] extends T.Effect<infer _R, infer E, infer A>
      ? T.Effect<any, E, A>
      : never;
  };
};

export function implementMock<S extends F.ModuleSpec<any>>(
  s: S
): <I extends Implementation<F.TypeOf<S>>>(
  i: I
) => F.Provider<
  F.UnionToIntersection<
    OnlyNew<F.TypeOf<S>, I> extends {
      [k in keyof OnlyNew<F.TypeOf<S>, I>]: {
        [h in keyof OnlyNew<F.TypeOf<S>, I>[k]]: infer X;
      };
    }
      ? F.InferR<X>
      : never
  >,
  F.TypeOf<S>,
  never
> {
  return (i) => F.implement(s)(i as any) as any;
}
