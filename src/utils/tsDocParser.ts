import * as tsdoc from "@microsoft/tsdoc";
import { DocComment } from "@microsoft/tsdoc";

const configuration: tsdoc.TSDocConfiguration = new tsdoc.TSDocConfiguration();
const _tsDocParser: tsdoc.TSDocParser = new tsdoc.TSDocParser(configuration);
const tsDocParser = (docCommentStr: string) => {
  const parserContext = _tsDocParser.parseString(docCommentStr);
  return parserContext.docComment;
};
const cache: Record<string, DocComment> = {};
const tsDocParserWithCache = (apiName: string, docCommentStr: string) => {
  if (cache[apiName]) {
    return cache[apiName];
  }
  cache[apiName] = tsDocParser(docCommentStr);
  return cache[apiName];
};

export default tsDocParserWithCache;
