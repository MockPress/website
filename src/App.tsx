/// <reference types="styled-jsx/global" />
import Docs from "./Docs";
import Editor from "./Editor";
import Viewer from "./Viewer";
import { INITIAL_CODE } from "./constants";
import "./main.css";
import saveToFile from "./utils/saveToFile";
import { generate, mock } from "mockpress";
import { useRef, useState } from "react";

const App: React.FC = () => {
  const codeRef = useRef<string>(INITIAL_CODE);
  const [_, forceUpdate] = useState({});
  const [isDocsOpen, setIsDocsOpen] = useState(true);
  const [resultOfGenerate, setResultOfGenerate] = useState<string>("");

  const handleGenerateButtonClick = () => {
    const cmd = codeRef.current;
    if (!cmd) {
      alert("please make a schema first");
      return;
    }
    window.generate = generate;
    window.mock = mock;
    const result = eval(cmd) as Record<string, any>;
    setResultOfGenerate(JSON.stringify(result, null, 2));
    delete window.generate;
    delete window.mock;
  };
  const handleResetButtonClick = () => {
    codeRef.current = INITIAL_CODE;
    forceUpdate({});
  };
  const handleCopyToClipboardButtonClick = () => {
    window.navigator.clipboard.writeText(resultOfGenerate).then(() => {
      alert("Copy Complete!");
    });
  };
  const handleDownloadButtonClick = () => {
    if (resultOfGenerate.length === 0) {
      alert("please generate data first !");
      return;
    }
    saveToFile("mock.json", resultOfGenerate);
  };
  const handleDocsButtonClick = () => {
    setIsDocsOpen((prev) => !prev);
  };
  const handleCloseDocsButtonClick = () => {
    setIsDocsOpen(false);
  };

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-10 border-b bg-white drop-shadow">
        <div className="flex justify-between items-center py-2 px-4">
          <div className="flex gap-4 items-center">
            <a href="/" className="flex items-center gap-2">
              <img
                className="w-[32px]"
                src="https://avatars.githubusercontent.com/u/116872366?s=200&v=4"
              />
              <b className="black">Mockpress</b>
            </a>
            <button type="button" onClick={handleDocsButtonClick}>
              Docs
            </button>
          </div>
          <div className="flex gap-4">
            <a
              href="https://github.com/MockPress/mockpress"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <span>GitHub</span>
              <svg
                width="13.5"
                height="13.5"
                aria-hidden="true"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"
                ></path>
              </svg>
            </a>
            <a
              href="https://github.com/MockPress/mockpress/discussions"
              target="_blank"
            >
              Feedback
            </a>
          </div>
        </div>
      </div>
      <div className="h-[52px]" />
      <div className="relative">
        <div className="flex border-b">
          <div className="w-1/2 p-2 border-r">
            <div className="p-2 border-b">
              <div className="flex gap-4">
                <button type="button" onClick={handleGenerateButtonClick}>
                  Generate
                </button>
                <button type="button" onClick={handleResetButtonClick}>
                  Reset
                </button>
              </div>
            </div>
            <div className="p-2 max-h-[70vh]">
              <Editor
                value={codeRef.current}
                onChange={(value) => {
                  codeRef.current = value;
                }}
              />
            </div>
          </div>
          <div className="w-1/2 p-2">
            <div className="p-2 border-b">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleCopyToClipboardButtonClick}
                >
                  Copy To Clipboard
                </button>
                <button type="button" onClick={handleDownloadButtonClick}>
                  Download
                </button>
              </div>
            </div>
            <div className="p-2 border-r-2 min-h-[70vh] max-h-[70vh] overflow-y-scroll">
              <Viewer value={resultOfGenerate} />
            </div>
          </div>
        </div>
        <Docs
          isOpen={isDocsOpen}
          onCloseButtonClick={handleCloseDocsButtonClick}
        />
      </div>
    </div>
  );
};

export default App;
