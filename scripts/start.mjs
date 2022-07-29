/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import inquirer from "inquirer";
import chalk from "chalk";
import { spawn } from "child_process";

import { projectList, proxyMap } from "./meta.mjs";

inquirer
  .prompt([
    {
      type: "list",
      name: "project",
      message: "⊙ 选择项目：",
      choices: projectList,
    },
    {
      type: "list",
      name: "proxy",
      message: "⊙ 选择接口代理：",
      choices: Object.keys(proxyMap),
    },
  ])
  .then((answers) => {
    const PROJECT_KEY = answers.project;
    const PROXY_KEY = answers.proxy;
    const useMock = !!PROXY_KEY.match(/mock/i);
    const proxyToDevServer = !!PROXY_KEY.match(/开发环境/);
    const proxyToTestServer = !!PROXY_KEY.match(/测试环境/);

    if (proxyToDevServer || proxyToTestServer) {
      console.log(
        chalk.yellow(`直连须知：需要修改本机 host，详情请查看 README`)
      );
      if (proxyToDevServer) {
        console.log(
          chalk.magenta(
            `登录开发环境: https://adssx-dev-gzdevops.tsintergy.com/usercenter/#/login`
          )
        );
        console.log(
          chalk.blue(
            `直连开发环境: http://dev.adssx-dev-gzdevops3.tsintergy.com:8000/`
          )
        );
      } else if (proxyToTestServer) {
        console.log(
          chalk.magenta(
            `登录测试环境: https://adssx-test-gzdevops3.tsintergy.com/usercenter/#/login`
          )
        );
        console.log(
          chalk.blue(
            `直连测试环境: http://dev.adssx-test-gzdevops3.tsintergy.com:8000/`
          )
        );
      }
    }

    spawn(
      /^win/.test(process.platform) ? "cross-env.cmd" : "cross-env",
      [
        ...process.argv.slice(2),
        `PROJECT_KEY=${PROJECT_KEY}`,
        `PROXY_KEY=${PROXY_KEY}`,
        `MOCK=${useMock || "none"}`,
        "max",
        "dev",
      ],
      {
        cwd: `packages/${PROJECT_KEY}`,
        stdio: "inherit",
      }
    );
  })
  .catch((error) => {
    console.log(error);
  });
