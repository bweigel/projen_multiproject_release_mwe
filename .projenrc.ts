import { monorepo } from "@aws/pdk";
import { JsonPatch } from "projen";
import { AwsCdkConstructLibrary } from "projen/lib/awscdk";
import { GithubWorkflow } from "projen/lib/github";

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

export function patchReleaseWorkflow(workflow?: GithubWorkflow) {
  workflow?.file?.patch(JsonPatch.replace(`/jobs/release_npm/steps`, [
    {
      uses: "actions/setup-node@v4",
      with: {
        "node-version": "20"
      }
    },
    {
      name: "Download build artifacts",
      uses: "actions/download-artifact@v4",
      with: {
        name: "build-artifact",
        path: "dist"
      },
    },
    {
      name: "Restore build artifact permissions",
      run: "cd dist && setfacl --restore=permissions-backup.acl",
      "continue-on-error": true
    },
    {
      name: "Release",
      env: {
        NPM_DIST_TAG: "latest",
        NPM_REGISTRY: "npm.pkg.github.com",
        NPM_TOKEN: "${{ secrets.GITHUB_TOKEN }}"
      },
      run: "npx -p publib@latest publib-npm"

    }
  ]));
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

patchReleaseWorkflow(project.github?.tryFindWorkflow('release_package_a'));
patchReleaseWorkflow(project.github?.tryFindWorkflow('release_package_b'));
project.synth();
