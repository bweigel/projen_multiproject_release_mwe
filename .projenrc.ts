import { monorepo } from "@aws/pdk";
const project = new monorepo.MonorepoTsProject({
  devDeps: ["@aws/pdk"],
  name: "projen_multiproject_release_mwe",
  projenrcTs: true,
});
project.synth();