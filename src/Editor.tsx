import {
  autocompletion,
  Completion,
  type CompletionContext,
} from "@codemirror/autocomplete";
import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { type ViewUpdate, keymap } from "@codemirror/view";
import { basicSetup, EditorView } from "codemirror";
import { useEffect, useRef } from "react";

type EditorProps = {
  className?: string;
  value: string;
  onChange: (value: string, viewUpdate: ViewUpdate) => void;
};

const Editor: React.FC<EditorProps> = ({ className, value, onChange }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const listener = EditorView.updateListener.of((viewUpdate: ViewUpdate) => {
      if (viewUpdate.docChanged) {
        const doc = viewUpdate.state.doc;
        const value = doc.toString();
        onChange(value, viewUpdate);
      }
    });

    const autos = autocompletion({
      override: [mockPressAutoComplete],
    });

    const view = new EditorView({
      extensions: [
        basicSetup,
        listener,
        EditorView.lineWrapping,
        javascript(),
        autos,
        keymap.of([indentWithTab]),
      ],
      parent: ref.current ?? undefined,
    });

    const editorValue = view.state.doc.toString();
    if (value !== editorValue) {
      view.dispatch({
        changes: {
          from: 0,
          to: editorValue.length,
          insert: value || "",
        },
      });
    }

    return () => {
      view.destroy();
    };
  }, [value]);

  return <div className={className} ref={ref} />;
};

const mockPressAutoComplete = (context: CompletionContext) => {
  let word = context.matchBefore(/\w*/);
  if (word === null) return null;

  if (word.from == word.to && !context.explicit) return null;

  return {
    from: word.from,
    options: [
      {
        label: "generate",
        type: "function",
        apply: "generate({\n\n}, 10)",
        info: "generate json based schema",
      },
      {
        label: "autoIncrement",
        type: "function",
        apply: "mock.autoIncrement(startPoint),",
        info: "Generates an auto incremented index, based on the loopIndex of the generator",
      },
      {
        label: "date",
        type: "function",
        apply: "mock.date(startDate, endDate),",
        info: "Generates a random date in the range of the given parameters",
      },
      {
        label: "image",
        type: "function",
        apply: "mock.image(width, height),",
        info: "Generates a random Image of the given size. Utilizes the images created by https://picsum.photos/",
      },
      {
        label: "integer",
        type: "function",
        apply: "mock.integer(min, max),",
        info: "Generates a random integer in the given range",
      },
      {
        label: "koreanAddress",
        type: "function",
        apply: "mock.koreanAddress(),",
        info: "Generates a random South Korean address. Generated address follow the basic rules of the South Korean address system. However, generated addresses are fake and do not exist in the real world",
      },
      {
        label: "koreanName",
        type: "function",
        apply: "mock.koreanName(),",
        info: "Generates a random Korean name. The options consist of popular male and female baby names between 2008-2021",
      },
      {
        label: "koreanSentence",
        type: "function",
        apply: "mock.koreanSentence('short' | 'medium' | 'long'),",
        info: "Generates a random korean sentence",
      },
      {
        label: "koreanWord",
        type: "function",
        apply: "mock.koreanWord(),",
        info: "Generates a random korean word",
      },
      {
        label: "money",
        type: "function",
        apply: "mock.money(min, max, interval),",
        info: "Generates a random amount of money in the given range",
      },
    ],
  };
};

export default Editor;
