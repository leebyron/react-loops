import React from "react";
import TestRenderer from "react-test-renderer";
import { For, If, ElseIf, Else } from "./react-loops.js";

function expectRenderToEqual(actual, expected) {
  const consoleError = console.error;
  try {
    console.error = message => {
      throw new Error(message);
    };
    expect(TestRenderer.create(actual).toJSON()).toEqual(
      TestRenderer.create(expected).toJSON()
    );
  } finally {
    console.error = consoleError;
  }
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

      it("loops TypedArray", () => {
        const list = new Uint8Array(3);
        list[1] = 10;
        list[2] = 20;
        expectRenderToEqual(
          <For of={list} as={item => <li>{item}</li>} />,
          <>
            <li>{0}</li>
            <li>{10}</li>
            <li>{20}</li>
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

      it("loops with a non-element string return", () => {
        const list = ["A", "B", "C"];
        expectRenderToEqual(
          <For of={list} as={item => item} />,
          <>
            {"A"}
            {"B"}
            {"C"}
          </>
        );
      });

      it("loops with a non-element Array return", () => {
        const list = ["A", "B", "C"];
        expectRenderToEqual(
          <For
            of={list}
            as={item => [<li key="0">{item}</li>, <li key="1">{item}</li>]}
          />,
          <>
            <li key="woof">A</li>
            <li>A</li>
            <li>B</li>
            <li>B</li>
            <li>C</li>
            <li>C</li>
          </>
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

    describe("error cases", () => {
      it("requires either of or in", () => {
        expectRenderToThrow(
          <For as={() => null} />,
          "<For> expects either an Iterable `of` or Object `in` prop."
        );
      });

      it("requires only one of of or in", () => {
        expectRenderToThrow(
          <For of={null} in={null} as={() => null} />,
          "<For> expects either an Iterable `of` or Object `in` prop."
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
    });
  });

  describe("if", () => {
    it("includes children if condition is truthy", () => {
      expectRenderToEqual(<If test={"truthy"}>Truthy?</If>, "Truthy?");
    });

    it("excludes children if condition is falsey", () => {
      expectRenderToEqual(<If test={0}>Truthy?</If>, null);
    });

    it("includes Else child if condition is falsey", () => {
      expectRenderToEqual(
        <If test={0}>
          Truthy?
          <Else>Falsey?</Else>
        </If>,
        "Falsey?"
      );
    });

    it("excludes Else child if condition is truthy", () => {
      expectRenderToEqual(
        <If test={1}>
          Truthy?
          <Else>Falsey?</Else>
        </If>,
        "Truthy?"
      );
    });

    it("evaluates ElseIf child if condition is falsey", () => {
      expectRenderToEqual(
        <If test={0}>
          Truthy?
          <ElseIf test={1}>Otherwise?</ElseIf>
        </If>,
        "Otherwise?"
      );
    });

    it("does not evaluate If child if condition is falsey", () => {
      expectRenderToEqual(
        <If test={0}>
          Truthy?
          <If test={1}>Otherwise?</If>
        </If>,
        null
      );
    });

    it("allows multiple nested ElseIf and Else cases", () => {
      expectRenderToEqual(
        <If test={0}>
          Truthy?
          <ElseIf test={0}>
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

    it("supports then prop", () => {
      expectRenderToEqual(<If test={1} then={"Truthy?"} />, "Truthy?");
      expectRenderToEqual(<If test={0} then={"Truthy?"} />, null);
    });

    it("supports then else prop", () => {
      expectRenderToEqual(
        <If test={1} then={"Truthy?"} else={"Falsey?"} />,
        "Truthy?"
      );
      expectRenderToEqual(
        <If test={0} then={"Truthy?"} else={"Falsey?"} />,
        "Falsey?"
      );
    });

    it("supports legacy case prop", () => {
      expectRenderToEqual(<If case={1} then={"Truthy?"} />, "Truthy?");
      expectRenderToEqual(<If case={0} then={"Truthy?"} />, null);
    });

    describe("error cases", () => {
      it("requires case", () => {
        expectRenderToThrow(<If then={null} />, "<If> requires a `test` prop.");
      });

      it("requires either then or children", () => {
        expectRenderToThrow(
          <If test={1} />,
          "<If> expects either a `then` prop or children."
        );
      });

      it("requires then when using else", () => {
        expectRenderToThrow(
          <If test={1} else={null} />,
          "<If> only use `else` prop alongside `then` prop."
        );
      });
    });
  });
});
