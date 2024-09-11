import { monorepo } from "@aws/pdk";
import { AwsCdkConstructLibrary } from "projen/lib/awscdk";

const project = new monorepo.MonorepoTsProject({
  devDeps: ["@aws/pdk"],
  name: "projen_multiproject_release_mwe",
  projenVersion: "0.87.2",
  projenrcTs: true,
  github: true,
});
project.addTask('package:js', {
  exec: 'npx nx run-many --target=package:js --output-style=stream --nx-bail',
});


const defaultOptions = {
  defaultReleaseBranch: "main",
  cdkVersion: "2.157.0",
  author: "author",
  authorAddress: "email@mail.com",
  workflowNodeVersion: "20",
  repositoryUrl: "https://repository.url",
  npmRegistryUrl: 'https://npm.pkg.github.com',
  release: true,
}

new AwsCdkConstructLibrary({
  parent: project,
  name: "package_a",
  outdir: "packages/package_a",
  packageName: `@bweigel/cdk-package_a`,
  ...defaultOptions
});


new AwsCdkConstructLibrary({
  parent: project,
  name: "package_b",
  outdir: "packages/package_b",
  packageName: `@bweigel/cdk-package_b`,
  ...defaultOptions
});

project.synth();