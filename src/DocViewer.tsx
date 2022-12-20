import { NODE_TYPE } from "./constants";
import * as tsdoc from "@microsoft/tsdoc";
import React from "react";

type DocViewerProps = {
  docComment: tsdoc.DocComment;
};
const DocViewer: React.FC<DocViewerProps> = ({ docComment }) => {
  const renderElements = (): React.ReactNode[] => {
    const outputElements: React.ReactNode[] = [];

    const {
      summarySection,
      params,
      returnsBlock,
      remarksBlock,
      customBlocks,
      seeBlocks,
    } = docComment;

    // summary
    if (summarySection) {
      outputElements.push(
        <Section title="Summary">{renderContainer(summarySection)}</Section>
      );
    }

    // remarks
    if (remarksBlock) {
      outputElements.push(
        <Section title="Remarks">
          {renderContainer(remarksBlock.content)}
        </Section>
      );
    }

    // parameters
    if (params.count > 0) {
      const rows: React.ReactNode[] = params.blocks.map((block, index) => {
        return (
          <tr key={`param-${index}`}>
            <td>{block.parameterName}</td>
            <td>{renderContainer(block.content)}</td>
          </tr>
        );
      });

      outputElements.push(
        <Section title="Parameters">
          {
            <table className="doc-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
              <style jsx>{`
                .doc-table {
                  text-align: center;
                }
              `}</style>
            </table>
          }
        </Section>
      );
    }

    // returns
    if (returnsBlock) {
      outputElements.push(
        <Section title="Return Value">
          {renderContainer(returnsBlock.content)}
        </Section>
      );
    }

    // example
    if (customBlocks) {
      const exampleBlocks = customBlocks.filter(
        (x) =>
          x.blockTag.tagNameWithUpperCase ===
          tsdoc.StandardTags.example.tagNameWithUpperCase
      );
      exampleBlocks.forEach((block, index) => {
        const heading =
          exampleBlocks.length > 1 ? `Example ${index + 1}` : "Example";

        outputElements.push(
          <Section title={heading}>{renderContainer(block.content)}</Section>
        );
      });
    }

    // see
    if (seeBlocks.length > 0) {
      const listItems = seeBlocks.map((block, index) => (
        <li key={`item_${index}`}>{renderContainer(block.content)}</li>
      ));
      outputElements.push(
        <Section title="See Also">{<ul>{listItems}</ul>}</Section>
      );
    }

    return outputElements;
  };

  const renderContainer = (
    section: tsdoc.DocNodeContainer
  ): React.ReactNode => {
    return (
      <React.Fragment>
        {section.nodes.map((node, index) => {
          const key = `key-${index + 1}`;
          return renderDocNode(node, key);
        })}
      </React.Fragment>
    );
  };

  const renderDocNode = (
    node: tsdoc.DocNode,
    key: string
  ): React.ReactNode | undefined => {
    const { kind } = node;
    switch (kind) {
      case NODE_TYPE.CodeSpan:
        return renderCodeSpan(node, key);
      case NODE_TYPE.ErrorText:
        return renderErrorText(node, key);
      case NODE_TYPE.EscapedText:
        return renderEscapedText(node, key);
      case NODE_TYPE.FencedCode:
        return renderFencedCode(node, key);
      case NODE_TYPE.LinkTag:
        return renderLinkTag(node, key);
      case NODE_TYPE.Paragraph:
        return renderParagraph(node, key);
      case NODE_TYPE.PlainText:
        return renderPlainText(node, key);
      case NODE_TYPE.SoftBreak:
        return renderSoftBreak(node, key);
    }
  };

  const renderCodeSpan = (
    node: tsdoc.DocNode,
    key: string
  ): React.ReactNode => (
    <code key={key} className="doc-code-span">
      {(node as tsdoc.DocCodeSpan).code}
    </code>
  );

  const renderErrorText = (
    node: tsdoc.DocNode,
    key: string
  ): React.ReactNode => (
    <React.Fragment key={key}>
      {(node as tsdoc.DocErrorText).text}
    </React.Fragment>
  );

  const renderEscapedText = (
    node: tsdoc.DocNode,
    key: string
  ): React.ReactNode => (
    <React.Fragment key={key}>
      {(node as tsdoc.DocEscapedText).decodedText}
    </React.Fragment>
  );

  const renderFencedCode = (
    node: tsdoc.DocNode,
    key: string
  ): React.ReactNode => (
    <pre>
      <code>{(node as tsdoc.DocFencedCode).code}</code>
      <style jsx>
        {`
          pre {
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            padding: 6px 10px;
            border-radius: 3px;
            white-space: pre-wrap;
          }
        `}
      </style>
    </pre>
  );

  const renderLinkTag = (node: tsdoc.DocNode, key: string): React.ReactNode => {
    const linkTag: tsdoc.DocLinkTag = node as tsdoc.DocLinkTag;
    if (linkTag.urlDestination) {
      const linkText: string = linkTag.linkText || linkTag.urlDestination;
      return (
        <a key={key} href="#">
          {linkText}
        </a>
      );
    } else {
      const identifier = (() => {
        // codeDestination 이란 무엇인가?
        if (linkTag.codeDestination) {
          // TODO: The library should provide a default rendering for this
          // memberReferences 는 뭐야??
          const memberReferences: ReadonlyArray<tsdoc.DocMemberReference> =
            linkTag.codeDestination.memberReferences;
          if (memberReferences.length > 0) {
            const memberIdentifier: tsdoc.DocMemberIdentifier | undefined =
              memberReferences[memberReferences.length - 1].memberIdentifier;
            if (memberIdentifier) {
              return memberIdentifier.identifier;
            }
          }
        }
        return "";
      })();
      const linkText: string = linkTag.linkText || identifier || "???";
      return (
        <a key={key} href="#">
          {linkText}
        </a>
      );
    }
  };

  const renderParagraph = (
    node: tsdoc.DocNode,
    key: string
  ): React.ReactNode => {
    const transformedParagraph: tsdoc.DocParagraph =
      tsdoc.DocNodeTransforms.trimSpacesInParagraph(node as tsdoc.DocParagraph);

    return <p key={key}>{renderContainer(transformedParagraph)}</p>;
  };

  const renderPlainText = (
    node: tsdoc.DocNode,
    key: string
  ): React.ReactNode => {
    return (
      <React.Fragment key={key}>
        {(node as tsdoc.DocPlainText).text}
      </React.Fragment>
    );
  };

  const renderSoftBreak = (
    node: tsdoc.DocNode,
    key: string
  ): React.ReactNode => {
    return <React.Fragment key={key}> </React.Fragment>;
  };

  return (
    <div className="overflow-y-scroll max-h-[calc(100vh_-_100px)]">
      {renderElements()}
    </div>
  );
};

type DocHeadingProps = {
  children: React.ReactNode;
};
const DocHeading: React.FC<DocHeadingProps> = ({ children }) => {
  return <h1 className="text-2xl font-semibold mb-2">{children}</h1>;
};

type SectionProps = {
  title: string;
  children: React.ReactNode;
};
const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <div className="mb-6">
      <DocHeading>{title}</DocHeading>
      {children}
    </div>
  );
};

type CodeProps = {
  children: React.ReactNode;
};
const Code: React.FC<CodeProps> = ({ children }) => {
  return (
    <code>
      {children}
      <style jsx>
        {`
          code {
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            padding: 6px 10px;
            border-radius: 3px;
            overflow: auto;
          }
        `}
      </style>
    </code>
  );
};

export default DocViewer;
