type JSXNode = JSX.Element | string | number | false | null | undefined;
type JSXChild = JSXNode | Array<JSXNode>

type ForCallback<T, K> = (
  item: T,
  meta: {
    index: number;
    length: number;
    key: K;
    isFirst: boolean;
    isLast: boolean;
  }
) => JSXChild;

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
): JSX.Element;
export function For<O extends {}, K extends keyof O>(
  props:
    | {
        in: O | null | undefined;
        as: ForCallback<O[K], K>;
      }
    | {
        in: O | null | undefined;
        children: ForCallback<O[K], K>;
      }
): JSX.Element;
