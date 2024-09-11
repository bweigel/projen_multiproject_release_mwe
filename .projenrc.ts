import { monorepo } from "@aws/pdk";
import { AwsCdkConstructLibrary } from "projen/lib/awscdk";

const project = new monorepo.MonorepoTsProject({
  devDeps: ["@aws/pdk"],
  name: "projen_multiproject_release_mwe",
  projenrcTs: true,
});

new AwsCdkConstructLibrary({
  parent: project,
  author: "author",
  authorAddress: "email@mail.com",
  cdkVersion: "2.157.0",
  defaultReleaseBranch: "main",
  name: "package_a",
  release: true,
  repositoryUrl: "https://repository.url",
  outdir: "packages/package_a",
});


new AwsCdkConstructLibrary({
  parent: project,
  author: "author",
  authorAddress: "email@mail.com",
  cdkVersion: "2.157.0",
  defaultReleaseBranch: "main",
  name: "package_b",
  release: true,
  repositoryUrl: "https://repository.url",
  outdir: "packages/package_b",
});

project.synth();