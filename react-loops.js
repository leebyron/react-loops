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
 * - `key`: The key for this item in the list, same as `index` for Arrays
 *          but string Object properties for `in` loops
 * - `isFirst`: True for the first iteration
 * - `isLast`: True for the last iteration
 *
 *   <ul>
 *     <For of={myList} as={(item, { isLast }) =>
 *       <li>{isLast && "and "}{item}</li>
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
      "<For> expects either a Collection `of` or Object `in` prop."
    );
  }

  if (hasIn) {
    // Get the object
    var obj = props.in;

    // Accept null / falsey as nothing to loop.
    if (!obj) {
      return null;
    }

    if (iterall.isCollection(obj) || typeof obj !== "object") {
      throw new TypeError(
        "<For in={}> expects a non-collection Object. " +
          "Perhaps you meant to use <For of={}> with a Collection?"
      );
    }

    // Map each object property into a React child, provide additional info if requested
    var keys = Object.keys(obj);
    var length = keys.length;
    var mapped = [];
    for (var i = 0; i < length; i++) {
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
        "<For of={}> expects an Array, Array-like, or Iterable collection. " +
          "Perhaps you meant to use <For in={}> with an Object?"
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
  for (var i = 0; i < length; i++) {
    mapped.push(mapIteration(mapper, list[i], i, length, i));
  }
  return mapped;
}

function mapIteration(mapper, item, index, length, key) {
  var result =
    mapper.length === 1
      ? mapper(item)
      : mapper(item, {
          index: index,
          length: length,
          key: key,
          isFirst: index === 0,
          isLast: index === length - 1
        });
  if (React.isValidElement(result) && !result.props.hasOwnProperty("key")) {
    return React.cloneElement(result, { key: String(key) });
  }
  return result;
}

// Export loops
Object.defineProperties(exports, {
  For: { enumerable: true, value: For },
  __esModule: { value: true }
});
