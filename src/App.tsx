import Editor from "./Editor";
import "./main.css";

const App: React.FC = () => {
  return (
    <div className="bg-slate-100">
      <Editor
        value={"Initial"}
        onChange={(value) => {
          console.log(value);
        }}
      />
    </div>
  );
};

export default App;
