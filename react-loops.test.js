import React from "react";
import TestRenderer from "react-test-renderer";
import { For, If, ElseIf, Else } from "./react-loops.js";

function expectRenderToEqual(actual, expected) {
  expect(TestRenderer.create(actual).toJSON()).toEqual(
    TestRenderer.create(expected).toJSON()
  );
}

function expectRenderToThrow(actual, error) {
  const consoleError = console.error;
  try {
    console.error = () => {};
    expect(() => TestRenderer.create(actual)).toThrow(error);
  } finally {
    console.error = consoleError;
  }
}

describe("react-loops", () => {
  describe("for", () => {
    describe("for-of", () => {
      it("loops an Array", () => {
        const list = ["A", "B", "C"];
        expectRenderToEqual(
          <For of={list} as={item => <li>{item}</li>} />,
          <>
            <li>A</li>
            <li>B</li>
            <li>C</li>
          </>
        );
      });

      it("Can use render-prop", () => {
        const list = ["A", "B", "C"];
        expectRenderToEqual(
          <For of={list}>{item => <li>{item}</li>}</For>,
          <>
            <li>A</li>
            <li>B</li>
            <li>C</li>
          </>
        );
      });

      it("loops an Array-like", () => {
        const list = { length: 3, 0: "A", 1: "B", 2: "C" };
        expectRenderToEqual(
          <For of={list} as={item => <li>{item}</li>} />,
          <>
            <li>A</li>
            <li>B</li>
            <li>C</li>
          </>
        );
      });

      it("loops an Iterable", () => {
        const list = new Set(["A", "B", "C"]);
        expectRenderToEqual(
          <For of={list} as={item => <li>{item}</li>} />,
          <>
            <li>A</li>
            <li>B</li>
            <li>C</li>
          </>
        );
      });

      it("loops null", () => {
        expectRenderToEqual(
          <For of={null} as={item => <li>{item}</li>} />,
          null
        );
      });

      it("loops an Array with metadata", () => {
        const list = ["A", "B", "C"];
        expectRenderToEqual(
          <For
            of={list}
            as={(item, { index, length, key, isFirst, isLast }) => (
              <li>
                {item}
                {index}
                {length}
                {key}
                {isFirst}
                {isLast}
              </li>
            )}
          />,
          <>
            <li>
              {"A"}
              {0}
              {3}
              {0}
              {true}
              {false}
            </li>
            <li>
              {"B"}
              {1}
              {3}
              {1}
              {false}
              {false}
            </li>
            <li>
              {"C"}
              {2}
              {3}
              {2}
              {false}
              {true}
            </li>
          </>
        );
      });
    });

    describe("for-in", () => {
      it("loops an Object", () => {
        const obj = { x: "A", y: "B", z: "C" };
        expectRenderToEqual(
          <For in={obj} as={item => <li>{item}</li>} />,
          <>
            <li>A</li>
            <li>B</li>
            <li>C</li>
          </>
        );
      });

      it("loops null", () => {
        expectRenderToEqual(
          <For in={null} as={item => <li>{item}</li>} />,
          null
        );
      });

      it("loops an Object with metadata", () => {
        const obj = { x: "A", y: "B", z: "C" };
        expectRenderToEqual(
          <For
            in={obj}
            as={(item, { index, length, key, isFirst, isLast }) => (
              <li>
                {item}
                {index}
                {length}
                {key}
                {isFirst}
                {isLast}
              </li>
            )}
          />,
          <>
            <li>
              {"A"}
              {0}
              {3}
              {"x"}
              {true}
              {false}
            </li>
            <li>
              {"B"}
              {1}
              {3}
              {"y"}
              {false}
              {false}
            </li>
            <li>
              {"C"}
              {2}
              {3}
              {"z"}
              {false}
              {true}
            </li>
          </>
        );
      });
    });

    describe("for-condition", () => {
      it("loops with int state", () => {
        expectRenderToEqual(
          <For initial={0} condition={i => i < 5} loop={i => i + 1}>
            {i => <li>{i}</li>}
          </For>,
          <>
            <li>0</li>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
          </>
        );
      });

      it("loops with string state", () => {
        expectRenderToEqual(
          <For initial={"x"} condition={s => s.length < 5} loop={s => s + "x"}>
            {s => <li>{s}</li>}
          </For>,
          <>
            <li>x</li>
            <li>xx</li>
            <li>xxx</li>
            <li>xxxx</li>
          </>
        );
      });

      it("loops with object state, doesn't set key", () => {
        expectRenderToEqual(
          <For
            initial={{ x: 0 }}
            condition={({ x }) => x < 2}
            loop={({ x }) => ({ x: x + 1 })}
          >
            {({ x }) => <li key={`${x}`}>{x}</li>}
          </For>,
          <>
            <li>0</li>
            <li>1</li>
          </>
        );
      });
    });

    describe("error cases", () => {
      it("requires, of, in, or condition", () => {
        expectRenderToThrow(
          <For as={() => null} />,
          "<For> expects an Iterable `of`, Object `in` prop, or Function `condition`."
        );
      });

      it("requires only one of of or in", () => {
        expectRenderToThrow(
          <For of={null} in={null} as={() => null} />,
          "<For> expects an Iterable `of`, Object `in` prop, or Function `condition`."
        );
      });

      it("requires either as or render-prop", () => {
        expectRenderToThrow(
          <For of={null} />,
          "<For> expects either a render-prop child or a Function `as` prop."
        );
      });

      it("requires only one of as or render-prop", () => {
        expectRenderToThrow(
          <For of={null} as={() => null}>
            {() => null}
          </For>,
          "<For> expects either a render-prop child or a Function `as` prop."
        );
      });

      it("requires either as or render-prop as function", () => {
        expectRenderToThrow(
          <For of={null} as={"not a func"} />,
          "<For> expects either a render-prop child or a Function `as` prop."
        );
        expectRenderToThrow(
          <For of={null}>not a func</For>,
          "<For> expects either a render-prop child or a Function `as` prop."
        );
      });

      it("requires loop as a function", () => {
        expectRenderToThrow(
          <For condition={() => {}} loop={'hello'} as={() => {}} />,
          "<For> with a `condition` expects both an `initial` value and Function `loop` prop."
        );
      });
    });
  });

  describe("if", () => {
    it("includes children if condition is truthy", () => {
      expectRenderToEqual(<If case={"truthy"}>Truthy?</If>, "Truthy?");
    });

    it("excludes children if condition is falsey", () => {
      expectRenderToEqual(<If case={0}>Truthy?</If>, null);
    });

    it("includes Else child if condition is falsey", () => {
      expectRenderToEqual(
        <If case={0}>
          Truthy?
          <Else>Falsey?</Else>
        </If>,
        "Falsey?"
      );
    });

    it("excludes Else child if condition is truthy", () => {
      expectRenderToEqual(
        <If case={1}>
          Truthy?
          <Else>Falsey?</Else>
        </If>,
        "Truthy?"
      );
    });

    it("evaluates ElseIf child if condition is falsey", () => {
      expectRenderToEqual(
        <If case={0}>
          Truthy?
          <ElseIf case={1}>Otherwise?</ElseIf>
        </If>,
        "Otherwise?"
      );
    });

    it("does not evaluate If child if condition is falsey", () => {
      expectRenderToEqual(
        <If case={0}>
          Truthy?
          <If case={1}>Otherwise?</If>
        </If>,
        null
      );
    });

    it("allows multiple nested ElseIf and Else cases", () => {
      expectRenderToEqual(
        <If case={0}>
          Truthy?
          <ElseIf case={0}>
            Otherwise?
            <Else>Not Otherwise?</Else>
          </ElseIf>
          <Else>Falsey?</Else>
        </If>,
        <>
          {"Not Otherwise?"}
          {"Falsey?"}
        </>
      );
    });

    it('supports then prop', () => {
      expectRenderToEqual(
        <If case={1} then={"Truthy?"} />,
        "Truthy?"
      )
      expectRenderToEqual(
        <If case={0} then={"Truthy?"} />,
        null
      )
    })


    it('supports then else prop', () => {
      expectRenderToEqual(
        <If case={1} then={"Truthy?"} else={"Falsey?"} />,
        "Truthy?"
      )
      expectRenderToEqual(
        <If case={0} then={"Truthy?"} else={"Falsey?"} />,
        "Falsey?"
      )
    })

    describe('error cases', () => {
      it('requires case', () => {
        expectRenderToThrow(
          <If then={null} />,
          '<If> requires a `case` prop.'
        )
      })

      it('requires either then or children', () => {
        expectRenderToThrow(
          <If case={1} />,
          '<If> expects either a `then` prop or children.'
        )
      })

      it('requires then when using else', () => {
        expectRenderToThrow(
          <If case={1} else={null} />,
          '<If> only use `else` prop alongside `then` prop.'
        )
      })
    })
  });
});
