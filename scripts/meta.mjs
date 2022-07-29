/*
 * @LastEditors: haols
 */
import fs from "fs";
import path from "path";
import fg from "fast-glob";

/**
 * PROJECT_KEY 列表，文件夹名对应 PROJECT_KEY
 */
export const projectList = fg.sync("*", {
  cwd: "packages",
  onlyDirectories: true,
});

const getProxy = (target, { API_PREFIX, API_NE_PREFIX, pathRewrite = {} }) => {
  const extraProxy = {};
  if (API_NE_PREFIX) {
    extraProxy[`${API_NE_PREFIX}/api/`] = {
      changeOrigin: true,
      target,
      pathRewrite,
    };
  }
  return {
    [`${API_PREFIX}/api/`]: {
      changeOrigin: true,
      target,
      pathRewrite,
    },
    ...extraProxy,
  };
};

/**
 * 项目共用的代理配置
 */
export const proxyMap = {
  YApi: ({ API_PREFIX, API_NE_PREFIX, YApiPathRewrite }) =>
    getProxy("http://dev.yapi.tsintergy.com/", {
      API_PREFIX,
      API_NE_PREFIX,
      pathRewrite: YApiPathRewrite,
    }),
  "Mock:localhost:8000": (obj) => getProxy("http://localhost:8000/", obj),
  开发环境: (obj) => getProxy("https://adssx-dev-gzdevops.tsintergy.com/", obj),
  测试环境: (obj) =>
    getProxy("https://adssx-test-gzdevops3.tsintergy.com/", obj),
  加鑫: (obj) => getProxy("http://192.168.101.27:8080/", obj),
  nice哥: (obj) => getProxy("http://172.31.1.146:8080/", obj),
};
