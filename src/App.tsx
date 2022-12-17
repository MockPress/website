import Editor from "./Editor";
import "./main.css";
import { generate, mock } from "mockpress";
import { useRef, useState } from "react";

const App: React.FC = () => {
  const codeRef = useRef<string>();
  const [resultOfGenerate, setResultOfGenerate] = useState<string>("");

  const handleGenerateButtonClick = () => {
    const cmd = codeRef.current;
    if (!cmd) {
      alert("명령어를 입력해 주세요");
      return;
    }
    window.generate = generate;
    window.mock = mock;
    const result = eval(cmd) as Record<string, any>;
    setResultOfGenerate(JSON.stringify(result, null, "\t"));
    delete window.generate;
    delete window.mock;
  };
  const handleResetButtonClick = () => {};

  return (
    <div className="bg-slate-100">
      <div className="flex justify-between">
        <div>
          <a href="/">Mockpress</a>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={handleGenerateButtonClick}>
            Generate
          </button>
          <button type="button" onClick={handleResetButtonClick}>
            Reset
          </button>
        </div>
        <div className="flex gap-2">
          <a href="github.com">Github</a>
          <a href="naver.com">Feedback</a>
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2">
          <div className="p-2 border-r-2 min-h-screen">
            <Editor
              value={"Initial"}
              onChange={(value) => {
                codeRef.current = value;
              }}
              language="javascript"
            />
          </div>
        </div>
        <div className="w-1/2">
          <div className="p-2 border-r-2 min-h-screen">
            <Editor
              value={resultOfGenerate}
              onChange={(value) => {
                console.log("value2 :", value);
              }}
              editable={false}
              language="json"
            ></Editor>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
