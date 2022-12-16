import { javascript } from "@codemirror/lang-javascript";
import { type ViewUpdate } from "@codemirror/view";
import { basicSetup, EditorView } from "codemirror";
import { useEffect, useRef, useState } from "react";

type EditorProps = {
  value: string;
  onChange: (value: string, viewUpdate: ViewUpdate) => void;
};

const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const listener = EditorView.updateListener.of((viewUpdate: ViewUpdate) => {
      if (viewUpdate.docChanged) {
        const doc = viewUpdate.state.doc;
        const value = doc.toString();
        onChange(value, viewUpdate);
      }
    });

    const view = new EditorView({
      extensions: [basicSetup, javascript(), listener],
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

  return <div ref={ref} />;
};

export default Editor;
