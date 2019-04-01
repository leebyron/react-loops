var React = require("react");
var iterall = require("iterall");

/**
 * Use the props `of` to provide the list and `as` to provide an element for
 * each item in the list. The `of` prop accepts Arrays, Array-likes,
 * and Iterables.
 *
 *   <ul>
 *     <For of={myList} as={item =>
 *       <li>{item}</li>
 *     }/>
 *   </ul>
 *
 * Or provide a "render prop" function as a child.
 *
 *   <ul>
 *     <For of={myList}>
 *       {item =>
 *         <li>{item}</li>
 *       }
 *     </For>
 *   </ul>
 *
 * Access additional information about each iteration by destructuring the
 * second argument:
 *
 * - `index`: A number from 0 to the length of the list
 * - `length`: The length of the list
 * - `key`: The key for this item in the list. Same as `index` for Arrays
 *          but string properties for `in` Objects
 * - `isFirst`: True for the first iteration
 * - `isLast`: True for the last iteration
 *
 *   <ul>
 *     <For of={myList} as={(item, { isLast }) =>
 *       <li><If case={isLast}>and </If>{item}</li>
 *     }/>
 *   </ul>
 *
 * *For in Loops*
 *
 * Use the prop `in` to provide an Object instead of an Array or Iterable.
 *
 *   <ul>
 *     <For in={myObj} as={(item, {key}) =>
 *       <li>{key}: {item}</li>
 *     }/>
 *   </ul>

 * *React Keys*
 *
 * Provide `key` on each child to ensure correct behavior if the list may be
 * reordered over time. If you don't provide `key`, the `key` of each
 * iteration will be used by default.
 *
 *   <ul>
 *     <For of={myList} as={item =>
 *       <li key={item.id}>{item.label}</li>
 *     }/>
 *   </ul>
 *
 */
function For(props) {
  // Get the mapping callback
  var mapper = props.children || props.as;
  if (
    typeof mapper !== "function" ||
    (props.hasOwnProperty("as") ^ props.hasOwnProperty("children")) === 0
  ) {
    throw new TypeError(
      "<For> expects either a render-prop child or a Function `as` prop."
    );
  }

  var hasIn = props.hasOwnProperty("in");
  if ((props.hasOwnProperty("of") ^ hasIn) === 0) {
    throw new TypeError(
      "<For> expects either an Iterable `of` or Object `in` prop."
    );
  }

  if (hasIn) {
    // Get the object
    var obj = props.in;

    // Accept null / falsey as nothing to loop.
    if (!obj) {
      return null;
    }

    // Map each object property into a React child, provide additional info if requested
    var keys = Object.keys(obj);
    var length = keys.length;
    var mapped = [];
    for (let i = 0; i < length; i++) {
      var key = keys[i];
      mapped.push(mapIteration(mapper, obj[key], i, length, key));
    }
    return mapped;
  }

  // Get the list
  var list = props.of;

  // Accept null / falsey as nothing to loop.
  if (!list) {
    return null;
  }

  // Convert non-Array collections to an Array.
  if (!Array.isArray(list)) {
    if (!iterall.isCollection(list)) {
      throw new TypeError(
        "<For> `of` expects an Array, Array-like, or Iterable collection"
      );
    }
    var array = [];
    iterall.forEach(list, function(item) {
      array.push(item);
    });
    list = array;
  }

  // Map each list item into a React child, provide additional info if requested
  var length = list.length;
  var mapped = [];
  for (let i = 0; i < length; i++) {
    mapped.push(mapIteration(mapper, list[i], i, length, i));
  }
  return mapped;
}

function mapIteration(mapper, item, index, length, key) {
  var itemChildren =
    mapper.length === 1
      ? mapper(item)
      : mapper(item, {
          index: index,
          length: length,
          key: key,
          isFirst: index === 0,
          isLast: index === length - 1
        });
  if (React.Children.count(itemChildren) === 1) {
    var child = React.Children.only(itemChildren);
    return child.props.hasOwnProperty("key")
      ? child
      : React.cloneElement(child, { key: key });
  }
  return itemChildren;
}

/**
 * Use the `case` prop with `<If>` and `<ElseIf>` elements to conditionally
 * include certain elements. When an `<If>` case is _truthy_ it does not
 * render any `<ElseIf>` or `<Else>` children. However when it is _falsey_ it
 * _only_ renders `<ElseIf>` and `<Else>` children.
 *
 *   <If case={someCondition}>
 *     This will only be shown if someCondition is truthy.
 *     <ElseIf case={otherCondition}>
 *       This will only be shown if someCondition is falsey
 *       and otherCondition is truthy.
 *       <Else>
 *         This will only be shown if both someCondition and
 *         otherCondition are both falsey.
 *       </Else>
 *     </ElseIf>
 *     <Else>
 *       This will be shown if someCondition is falsey.
 *       <If case={finalCondition}>
 *         This will be shown if someCondition is falsey
 *         and finalCondition is truthy.
 *       </If>
 *     </Else>
 *   </If>
 *
 * Alternatively, you can provide `then` and `else` props.
 *
 *   <If case={someCondition} then={
 *     "This will only be shown if someCondition is truthy."
 *   } else={
 *     "This will be shown if someCondition is falsey."
 *   }/>
 *
 */
function If(props) {
  if (!props.hasOwnProperty("case")) {
    throw new TypeError("<If> requires a `case` prop.");
  }
  var condition = Boolean(props.case);
  var hasElse = props.hasOwnProperty("else");
  var hasThen = props.hasOwnProperty("then");
  if (hasElse && !hasThen) {
    throw new TypeError("<If> only use `else` prop alongside `then` prop.");
  }
  if ((hasThen ^ props.hasOwnProperty("children")) === 0) {
    throw new TypeError("<If> expects either a `then` prop or children.");
  }
  if (hasThen) {
    return condition ? props.then : hasElse ? props.else : null;
  }
  return React.Children.map(props.children, function(child) {
    var isElse = child.type === Else || child.type === ElseIf;
    return condition !== isElse ? child : null;
  });
}

function Else(props) {
  return props.children;
}

function ElseIf(props) {
  return React.createElement(If, props);
}

// Export loops
Object.defineProperties(exports, {
  For: { enumerable: true, value: For },
  If: { enumerable: true, value: If },
  Else: { enumerable: true, value: Else },
  ElseIf: { enumerable: true, value: ElseIf },
  __esModule: { value: true }
});
