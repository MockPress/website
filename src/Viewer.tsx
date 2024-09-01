/* eslint-disable */

import { json } from "@codemirror/lang-json";
import { type ViewUpdate } from "@codemirror/view";
import { basicSetup, EditorView } from "codemirror";
import { useEffect, useRef } from "react";

type ViewerProps = {
  className?: string;
  value: string;
};

const Viewer: React.FC<ViewerProps> = ({ className, value }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const view = new EditorView({
      extensions: [
        basicSetup,
        EditorView.editable.of(false),
        EditorView.lineWrapping,
        json(),
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

export default Viewer;
