import { useEffect, useState } from "react";

type DocType = {
  name: string;
  docComment: string;
};

const useGetDocJSON = () => {
  const [mockDoc, setMockDoc] = useState<Array<DocType>>([]);
  const [utilDoc, setUtilDoc] = useState<Array<DocType>>([]);

  useEffect(() => {
    fetch("https://mockpress.site/mockpress.api.json")
      .then((response) => response.json())
      .then((response) => {
        const members = response["members"][0]["members"] as Array<any>;
        const mock = (
          members.find((member) => member.name === "mock")["members"] as any[]
        ).map(({ name, docComment }) => ({ name, docComment }));
        const util = (
          members.find((member) => member.name === "util")["members"] as any[]
        ).map(({ name, docComment }) => ({ name, docComment }));

        setMockDoc(mock);
        setUtilDoc(util);
      });
  }, []);

  return { mockDoc, utilDoc };
};

export default useGetDocJSON;
