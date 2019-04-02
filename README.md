<img align="right" src="assets/hook-and-loop.gif">

# React Loops — _React Velcro Architecture_

[![Build Status](https://travis-ci.com/leebyron/react-loops.svg?branch=master)](https://travis-ci.com/leebyron/react-loops)

React Loops work alongside React Hooks as part of the novel _React Velcro_
architecture for building sticky, secure user interfaces that don't come apart
under pressure.

## Get Started with Velcro by installing React Loops!

```sh
yarn add react-loops
```

## For Loops

Use the props `of` to provide the list and `as` to provide an element for
each item in the list. The `of` prop accepts Arrays, Array-likes,
and Iterables.

```js
<ul>
  <For of={myList} as={item =>
    <li>{item}</li>
  }/>
</ul>
```

Or provide a "render prop" function as a child.

```js
<ul>
  <For of={myList}>
    {item =>
      <li>{item}</li>
    }
  </For>
</ul>
```

Access additional information about each iteration by destructuring the
second argument:

- `index`: A number from 0 to the length of the list
- `length`: The length of the list
- `key`: The key for this item in the list. Same as `index` for Arrays
         but string properties for `in` Objects
- `isFirst`: True for the first iteration
- `isLast`: True for the last iteration

```js
<ul>
  <For of={myList} as={(item, { isLast }) =>
    <li><If case={isLast}>and </If>{item}</li>
  }/>
</ul>
```

### For in Loops

Use the prop `in` to provide an Object instead of an Array or Iterable.

```js
<ul>
  <For in={myObj} as={(item, {key}) =>
    <li>{key}: {item}</li>
  }/>
</ul>
```

### React Keys

Provide `key` on each child to ensure correct behavior if the list may be
reordered over time. If you don't provide `key`, the `key` of each
iteration will be used by default.

```js
<ul>
  <For of={myList} as={item =>
    <li key={item.id}>{item.label}</li>
  }/>
</ul>
```


## If conditions

Use the `case` prop with `<If>` and `<ElseIf>` elements to conditionally
include certain elements. When an `<If>` case is _truthy_ it does not
render any `<ElseIf>` or `<Else>` children. However when it is _falsey_ it
_only_ renders `<ElseIf>` and `<Else>` children.

```js
<If case={someCondition}>
  This will only be shown if someCondition is truthy.
  <ElseIf case={otherCondition}>
    This will only be shown if someCondition is falsey
    and otherCondition is truthy.
    <Else>
      This will only be shown if both someCondition and
      otherCondition are both falsey.
    </Else>
  </ElseIf>
  <Else>
    This will be shown if someCondition is falsey.
    <If case={finalCondition}>
      This will be shown if someCondition is falsey
      and finalCondition is truthy.
    </If>
  </Else>
</If>
```

Alternatively, you can provide `then` and `else` props.

```js
<If
  case={someCondition}
  then={"This will only be shown if someCondition is truthy."}
  else={"This will be shown if someCondition is falsey."}
/>
```


## What is _React Velcro_?

Only the newest, coolest, most blazing fast React architecture out there!

React Hooks has been an exciting development in the evolution of React, but it
felt like it was only half of the story. React Loops completes the gripping
picture by providing React's missing control-flow operators via JSX elements.

### Is this a Joke?

Take a look at this side by side with the old looping pattern and you tell me.

<img src="assets/loops-vs-mapkeys.png">
