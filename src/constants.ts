export const INITIAL_CODE =
  "generate({\n" +
  "  id: mock.autoIncrement(),\n" +
  '  introduce: mock.koreanSentence("short"),\n' +
  "  name: mock.koreanName(),\n" +
  "  hello: (current, loopIndex) => { // custom function is allowed\n" +
  "    return `Hello my name is ${current.name}`;\n" +
  "  },\n" +
  "  hobby: {\n" +
  "    cost: mock.money(1000, 5000, 500),\n" +
  "    name: mock.koreanWord(),\n" +
  "    introduce: (current, loopIndex) => { // current can access anywhere\n" +
  "      return `Hobby of ${current.name} is ${current.hobby.name}. And cost is ${current.hobby.cost}`\n" +
  "    }\n" +
  "  }\n" +
  "}, 10);";

type MockItemType = {
  title: string;
  subTitle: string;
  detail: string;
};
export const MOCKS: MockItemType[] = [
  {
    title: "autoIncrement",
    subTitle: "1, 2, 3 ...",
    detail: "autoIncrement - detail",
  },
  {
    title: "date",
    subTitle: "2023-01-18T06:29:44.451Z",
    detail: "date - detail",
  },
  {
    title: "image",
    subTitle: "https://picsum.photos/200/200?random=0",
    detail: "subTitle - detail",
  },
  {
    title: "integer",
    subTitle: "807, 312 ...",
    detail: "integer - detail",
  },
  {
    title: "koreanAddress",
    subTitle: "가람시 남동구 카라대로 391",
    detail: "koreanAddress - detail",
  },
  {
    title: "koreanName",
    subTitle: "박성민, 조재희 ...",
    detail: "koreanName - detail",
  },
  {
    title: "koreanSentence",
    subTitle: "행정각부의 설치·조직과 직무범위는 법률로 정한다.",
    detail: "koreanSentence - detail",
  },
  {
    title: "koreanWord",
    subTitle: "지방자치단체",
    detail: "koreanWord - detail",
  },
  {
    title: "money",
    subTitle: "3000",
    detail: "money - detail",
  },
];
