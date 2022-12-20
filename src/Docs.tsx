import DocViewer from "./DocViewer";
import CloseIcon from "./assets/close-icon.svg";
import useGetDocJSON from "./hooks/useGetDocJSON";
import tsDocParserWithCache from "./utils/tsDocParser";
import classNames from "classnames";
import { MouseEventHandler, useEffect, useMemo, useState } from "react";

type DocsProps = {
  isOpen: boolean;
  onCloseButtonClick: MouseEventHandler<HTMLButtonElement>;
};

const Docs: React.FC<DocsProps> = ({
  isOpen,
  onCloseButtonClick: handleCloseButtonClick,
}) => {
  const { mockDoc, utilDoc } = useGetDocJSON();
  const [activeApiName, setActiveApiName] = useState<string | null>(null);
  const [activeDocType, setActiveDocType] = useState<"mock" | "util">("mock");
  const activeDoc = activeDocType === "mock" ? mockDoc : utilDoc;

  useEffect(() => {
    if (mockDoc.length === 0) return;
    const { name } = mockDoc[0];
    setActiveApiName(name);
  }, [mockDoc]);

  const activeDocComment = useMemo(() => {
    const result = activeDoc.find(({ name }) => name === activeApiName);
    if (result) {
      return tsDocParserWithCache(result.name, result.docComment);
    }
    return null;
  }, [activeApiName]);

  const handleApiItemClick = (apiName: string) => () => {
    activeDoc
      .filter(({ name }) => name === apiName)
      .map(({ name, docComment: docCommentStr }) => {
        setActiveApiName(name);
      });
  };
  const handleMockButtonClick = () => setActiveDocType("mock");
  const handleUtilButtonClick = () => setActiveDocType("util");

  return (
    <div className="self absolute right-0 top-0 bottom-0 bg-zinc-100">
      <div className="flex h-full">
        <div className="relative h-full bg-zinc-200 px-6 pt-8 w-[25vw] shadow-[inset_rgba(108,109,111,0.36)_-3px_-6px_12px_2px]">
          <div>
            <button
              type="button"
              onClick={handleCloseButtonClick}
              className="absolute left-2 top-2 w-[20px]"
            >
              <img src={CloseIcon} />
            </button>
            {activeDocComment && <DocViewer docComment={activeDocComment} />}
          </div>
        </div>
        <div className="h-full px-8 w-[25vw]">
          <div className="flex pb-4">
            <Switch
              className="grow"
              active={activeDocType === "mock"}
              onClick={handleMockButtonClick}
            >
              Mock
            </Switch>
            <Switch
              className="grow"
              active={activeDocType === "util"}
              onClick={handleUtilButtonClick}
            >
              Util
            </Switch>
          </div>
          <div>
            <ul>
              {activeDoc.map(({ name }, index) => {
                return (
                  <li key={index} className="pb-4">
                    <ApiItem
                      title={name}
                      subTitle={""}
                      active={activeApiName === name}
                      onClick={handleApiItemClick(name)}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .self {
            height: calc(100vh - 52px);
            transition-property: transform;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 500ms;
            transform: translateX(${isOpen ? "0%" : "100%"});
          }
          .menu-item {
            border-bottom: 1px solid transparent;
            &.active {
              border-bottom-color: red;
            }
          }
        `}
      </style>
    </div>
  );
};

type ApiItemProps = {
  title: string;
  subTitle: string;
  active: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
};
const ApiItem: React.FC<ApiItemProps> = ({
  title,
  subTitle,
  active,
  onClick: handleClick,
}) => {
  const cn = classNames("w-full", "text-left", { active });
  return (
    <button type="button" className={cn} onClick={handleClick}>
      <h3 className="text-xl mb-2">{title}</h3>
      <p className="text-right">{subTitle}</p>
      <style jsx>{`
        button.active {
          color: red;
        }
      `}</style>
    </button>
  );
};

type SwitchProps = {
  active: boolean;
  className: string;
  children: React.ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
};
const Switch: React.FC<SwitchProps> = ({
  className,
  children,
  active,
  onClick: handleClick,
}) => {
  const cn = classNames(className, { active }, "text-lg");
  return (
    <button type="button" onClick={handleClick} className={cn}>
      {children}
      <style jsx>
        {`
          button {
            color: gray;
            border-bottom: 1px solid transparent;
            transition: border-bottom 0.3s, color 0.2s;
            &.active {
              color: black;
              border-bottom-color: red;
            }
          }
        `}
      </style>
    </button>
  );
};

export default Docs;
