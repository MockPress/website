import { CompletionContext } from "@codemirror/autocomplete";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { type ViewUpdate } from "@codemirror/view";
import { basicSetup, EditorView } from "codemirror";
import { useEffect, useRef } from "react";

type EditorProps = {
  className?: string;
  value: string;
  onChange: (value: string, viewUpdate: ViewUpdate) => void;
  editable?: boolean;
  language: "javascript" | "json";
};

const Editor: React.FC<EditorProps> = ({
  className,
  value,
  onChange,
  editable = true,
  language,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const listener = EditorView.updateListener.of((viewUpdate: ViewUpdate) => {
      if (viewUpdate.docChanged) {
        const doc = viewUpdate.state.doc;
        const value = doc.toString();
        onChange(value, viewUpdate);
      }
    });

    const extensions = [
      basicSetup,
      listener,
      EditorView.editable.of(editable),
      EditorView.lineWrapping,
    ];

    if (language === "javascript") {
      extensions.push(javascript());
    } else if (language === "json") {
      extensions.push(json());
    }

    const view = new EditorView({
      extensions,
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

export default Editor;
