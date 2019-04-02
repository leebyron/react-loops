///<reference types="react"/>

type ForCallback<T, K> = (
  item: T,
  meta: {
    index: number;
    length: number;
    key: K;
    isFirst: boolean;
    isLast: boolean;
  }
) => React.ReactNode;

export function For<T>(
  props:
    | {
        of: Iterable<T> | ArrayLike<T> | null | undefined;
        as: ForCallback<T, number>;
      }
    | {
        of: Iterable<T> | ArrayLike<T> | null | undefined;
        children: ForCallback<T, number>;
      }
): React.ReactNode;
export function For<O extends Object, K extends keyof O>(
  props:
    | {
        in: O | null | undefined;
        as: ForCallback<O[K], K>;
      }
    | {
        in: O | null | undefined;
        children: ForCallback<O[K], K>;
      }
): React.ReactNode;

export function If(props: {
  test: any;
  children: React.ReactNode;
}): React.ReactNode;

export function ElseIf(props: {
  test: any;
  children: React.ReactNode;
}): React.ReactNode;

export function Else(props: { children: React.ReactNode }): React.ReactNode;
