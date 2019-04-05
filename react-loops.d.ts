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
        fallback?: JSX.Element;
      }
    | {
        of: Iterable<T> | ArrayLike<T> | null | undefined;
        children: ForCallback<T, number>;
        fallback?: JSX.Element;
      }
): React.ReactNode;
export function For<O extends {}, K extends keyof O>(
  props:
    | {
        in: O | null | undefined;
        as: ForCallback<O[K], K>;
        fallback?: JSX.Element;
      }
    | {
        in: O | null | undefined;
        children: ForCallback<O[K], K>;
        fallback?: JSX.Element;
      }
): React.ReactNode;
