type JSXNode = JSX.Element | string | number | false | null | undefined;
type JSXChild = JSXNode | Array<JSXNode>;
type LazyJSXChild = (() => JSXChild) | JSXChild;

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
        ifEmpty?: LazyJSXChild;
        as: ForCallback<T, number>;
      }
    | {
        of: Iterable<T> | ArrayLike<T> | null | undefined;
        ifEmpty?: LazyJSXChild;
        children: ForCallback<T, number>;
      }
): JSX.Element;
export function For<O extends {}, K extends keyof O>(
  props:
    | {
        in: O | null | undefined;
        ifEmpty?: LazyJSXChild;
        as: ForCallback<O[K], K>;
      }
    | {
        in: O | null | undefined;
        ifEmpty?: LazyJSXChild;
        children: ForCallback<O[K], K>;
      }
): JSX.Element;
