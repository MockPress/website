import CloseIcon from "./assets/close-icon.svg";
import { MOCKS } from "./constants";
import classNames from "classnames";
import { MouseEventHandler, useState } from "react";

type DocsProps = {
  isOpen: boolean;
  onCloseButtonClick: MouseEventHandler<HTMLButtonElement>;
};

const Docs: React.FC<DocsProps> = ({
  isOpen,
  onCloseButtonClick: handleCloseButtonClick,
}) => {
  const [detailInfo, setDetailInfo] = useState(MOCKS[0]["detail"]);
  const handleListItemClick = (detail: string) => () => {
    setDetailInfo(detail);
  };
  const [activeDoc, setActiveDoc] = useState<"mock" | "util">("mock");
  const handleMockButtonClick = () => setActiveDoc("mock");
  const handleUtilButtonClick = () => setActiveDoc("util");

  return (
    <div className="self absolute right-0 top-0 bottom-0 bg-zinc-100">
      <div className="flex h-full">
        <div className="relative h-full bg-zinc-200 px-6 pt-8 w-[22vw] shadow-[inset_rgba(108,109,111,0.36)_-3px_-6px_12px_2px]">
          <div>
            <button
              type="button"
              onClick={handleCloseButtonClick}
              className="absolute left-2 top-2 w-[20px]"
            >
              <img src={CloseIcon} />
            </button>
            {detailInfo}
          </div>
        </div>
        <div className="h-full px-8 w-[28vw]">
          <div className="flex pb-4">
            <Switch
              className="grow"
              active={activeDoc === "mock"}
              onClick={handleMockButtonClick}
            >
              Mock
            </Switch>
            <Switch
              className="grow"
              active={activeDoc === "util"}
              onClick={handleUtilButtonClick}
            >
              Util
            </Switch>
          </div>
          <div>
            <ul>
              {MOCKS.map((mock, index) => {
                return (
                  <li
                    key={index}
                    onClick={handleListItemClick(mock.detail)}
                    className="pb-4"
                  >
                    <MockItem title={mock.title} subTitle={mock.subTitle} />
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

type MockItemProps = {
  title: string;
  subTitle: string;
};
const MockItem: React.FC<MockItemProps> = ({ title, subTitle }) => {
  return (
    <div className="self">
      <h3 className="text-xl mb-2">{title}</h3>
      <p className="text-right">{subTitle}</p>
    </div>
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
