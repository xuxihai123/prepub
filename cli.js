const { spawnSync, execSync } = require("child_process");
const chalk = require("chalk");
const axios = require("axios");
const path = require("path");
const fs = require("fs");

const npmPrefix = getNpmPrefix();
const cwd = process.cwd();
const npmbin = `${npmPrefix}/bin/npm`;

const logdata = require("./status.json");

const validNames = logdata.validName;
const indexs = logdata.indexs;

const CHARS = " abcdefghijklmnopqrstuvwxyz";
// const CHARS= [...Array(26)].map((_,i)=>String.fromCharCode(i+97)).join('')

function getNextName() {
  for (var i = indexs.length - 1; i >= 0; i--) {
    let temp = indexs[i];
    temp++;
    if (temp < 27) {
      indexs[i] = temp;
      return indexs
        .map((temp) => CHARS[temp])
        .join("")
        .trim();
    } else {
      indexs[i] = 0;
      temp = 0;
    }
  }
}

async function start() {
  console.log("exec cwd:", cwd);

  while (true) {
    const nextName = getNextName();
    console.log("nextName:", nextName);
    replaceName(nextName);
    await handle(nextName);

    fs.writeFileSync(
      "./status.json",
      JSON.stringify({ indexs, validNames }, null, 2)
    );
  }

  //   console.log(jsonObj);
}

function replaceName(name) {
  try {
    const file = path.resolve(cwd, "pkg/package.json");
    var pkgObj = require(file);
    pkgObj.name = name;
    fs.writeFileSync(file, JSON.stringify(pkgObj, null, 2), "utf8");
  } catch (e) {
    console.log(e);
  }
}

function getNpmPrefix() {
  return require("child_process")
    .execSync("npm config get prefix")
    .toString()
    .trim();
}

function toPublish(name) {
  try {
    var cmd = `${npmbin} publish .`;
    console.log("exec cmd:", cmd);
    const pwd = path.resolve(cwd, "pkg");
    execSync(cmd, { cwd: pwd, env: process.env, stdio: "inherit" });
    console.log("exec ok!");
    validNames.push(name);
  } catch (error) {
    console.log("publish err:", error);
  }
}

async function handle(name) {
  try {
    const res = await axios.get("https://registry.npmjs.org/" + name);
    if (res.ok) {
      return;
    }
  } catch (error) {
    toPublish(name);
  }
}

start();
