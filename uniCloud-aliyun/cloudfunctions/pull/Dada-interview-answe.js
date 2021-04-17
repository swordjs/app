let json = [
  {
    id: "interview-answe#247",
    source: "interview-answe",
    title: "[vue]https://binaryify.github.io/NeteaseCloudMusicApi/#/",
    type: "default",
    link: "https://github.com/webVueBlog/interview-answe/issues/247",
    answered: "no",
    status: "opened",
    author: "webVueBlog",
    content: "",
  }
]
const typeAlias = {
  vue: [{ $oid: "5fefd5700431ca0001cdeca7" }],
  JavaScript: [{ $oid: "5ff5bc70c23632000132f512" }],
  html: [{ $oid: "5ff5bc68fce5d000011cd514" }],
  html5: [{ $oid: "5ff5bc68fce5d000011cd514" }],
  css: [{ $oid: "5ff5bc78fce5d000011cd530" }],
  "HTML&CSS html": [
    { $oid: "5ff5bc68fce5d000011cd514" },
    { $oid: "5ff5bc78fce5d000011cd530" },
  ],
  小程序: [{ $oid: "5fdfe2df23976b0001d43aa3" }],
  "HTML&CSS": [
    { $oid: "5ff5bc68fce5d000011cd514" },
    { $oid: "5ff5bc78fce5d000011cd530" },
  ],
  jquery: [{ $oid: "5fefd6cb0431ca0001cdeee2" }],
  开发及性能优化: [{ $oid: "607a914096f59a0001add4c8" }],
  HTTP: [{ $oid: "607a914febbd8d00015f3057" }],
  性能优化: [{ $oid: "607a914096f59a0001add4c8" }],
  面试: [{ $oid: "607a9158f0faa600017e96b6" }],
};
const type = json.map((j) => j.type);
const date = new Date().toISOString();
let _json = "";
json = json.map((j) => {
  if (typeAlias[j.type]) {
    // 查询title中的[]和序号并清除
    let i = j.title.indexOf(".");
    if (i >= 0) {
      j.title = j.title.substr(i+1);
      let y = j.title.indexOf("]");
      if(y >= 0){
        j.title = j.title.substr(y+1);
      }
    }
    _json += JSON.stringify({
      title: j.title,
      areaID: { $oid: "5fdf56a3e2c1ee0001a52e49" },
      publishUserID: { $oid: "607a97c7d3b60a0001c7dd53" },
      questionExplanation: [],
      content: j.content,
      state: "pass",
      tagID: typeAlias[j.type],
      createDate: date,
      updateDate: date,
      deleteDate: "",
    });
    _json += "\n";
  }
});

console.log(_json);
