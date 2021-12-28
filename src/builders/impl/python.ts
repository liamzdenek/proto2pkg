import {BuildContext, Builder, PackageNameStyle} from "../Builder";
import * as path from "path";
import {execShellCommand} from "../../util/execShellCommand";
import {promises as fs} from "fs";
import {PROTOC_BIN_PROMISE, GRPC_PYTHON_PLUGIN_BIN_PROMISE} from "./common";

export interface PyProtoBuilderConfig {
    args: string[],
    readmeGenerator: (ctx: BuildContext, cfg: PyProtoBuilderConfig) => string;
}

interface ExtraDeps { [k: string]: string }

const createPythonProtoBuilder = (cfg: PyProtoBuilderConfig): Builder => {
    return {
        packageNameStyle: PackageNameStyle.SnakeCase,
        async checkPrerequisites(ctx) {
            let errors: Error[] = [];
            console.log('dirname', __dirname);
            try {
                await PROTOC_BIN_PROMISE;
                await GRPC_PYTHON_PLUGIN_BIN_PROMISE;
            } catch(newErrors: any) {
                errors.push(...newErrors);
            }
            return errors;
        },
        async build(ctx) {
            const protoFiles = path.join(ctx.sourceDir, "/src/main.proto");
            const PROTOC_BIN = await PROTOC_BIN_PROMISE;
            const GRPC_PYTHON_PLUGIN_BIN = await GRPC_PYTHON_PLUGIN_BIN_PROMISE;
            await execShellCommand(ctx, PROTOC_BIN, [
                `--plugin=protoc-gen-grpc_python=${GRPC_PYTHON_PLUGIN_BIN}`,
                protoFiles,
                `-I${ctx.sourceDir}`,
                `--python_out=${ctx.thisBuildContext.distDir}`,
                `--grpc_python_out=${ctx.thisBuildContext.distDir}`,
                ...cfg.args
            ], ctx.sourceDir);
            await fs.mkdir(path.join(ctx.thisBuildContext.distDir, "tests"), { recursive: true });
            await fs.writeFile(path.join(ctx.thisBuildContext.distDir, "src/__init__.py"), ""); // required to make python recognize the dir as a module

            // move all the files into a correct subdir
            await fs.mkdir(path.join(ctx.thisBuildContext.distDir, "src/", ctx.thisBuildContext.packageName), { recursive: true});
            for(let file of await fs.readdir(path.join(ctx.thisBuildContext.distDir, "src"))) {
                if(file === ctx.thisBuildContext.packageName) {
                    continue;
                }
                console.log('file', file);
                await execShellCommand(ctx, "mv", [
                    path.join(ctx.thisBuildContext.distDir, "src", file),
                    path.join(ctx.thisBuildContext.distDir, "src/", ctx.thisBuildContext.packageName)
                ], ctx.thisBuildContext.distDir);
            }/*
            await fs.writeFile(path.join(ctx.thisBuildContext.distDir, "tsconfig.json"), generateTsconfig(ctx, cfg));
            await fs.writeFile(path.join(ctx.thisBuildContext.distDir, "package.json"), generatePackageJson(ctx, cfg));
            await fs.writeFile(path.join(ctx.thisBuildContext.distDir, ".gitignore"), generateGitignore(ctx, cfg));
            await fs.writeFile(path.join(ctx.thisBuildContext.distDir, ".npmignore"), generateNpmignore(ctx, cfg));
            */
            await fs.writeFile(path.join(ctx.thisBuildContext.distDir, "README.md"), cfg.readmeGenerator(ctx,cfg));
            await fs.writeFile(path.join(ctx.thisBuildContext.distDir, "pyproject.toml"), generatePyProjToml(ctx, cfg));
            await fs.writeFile(path.join(ctx.thisBuildContext.distDir, "setup.cfg"), generateSetupCfg(ctx, cfg));
            await execShellCommand(ctx, "python3", ["-m", "pip", "install", "--upgrade", "build"], ctx.thisBuildContext.distDir);
            await execShellCommand(ctx, "python3", ["-m", "build"], ctx.thisBuildContext.distDir);
            return {
                errors: []
            };
        }
    };
}

export const PythonDual = createPythonProtoBuilder({
    args: [],
    readmeGenerator: ctx => ""
})

const generatePyProjToml = (ctx: BuildContext, cfg: PyProtoBuilderConfig) => (
`requires = [
    "setuptools>=42",
    "wheel"
]
build-backend = "setuptools.build_meta"
`);

const generateSetupCfg = (ctx: BuildContext, cfg: PyProtoBuilderConfig) => (
`[metadata]
name = ${ctx.thisBuildContext.packageName}
version = ${ctx.proto2pkgJson.version}
author = Example Author
author_email = author@example.com
description = Proto2pkg generated python package for ${ctx.proto2pkgJson.name}
long_description = file: README.md
long_description_content_type = text/markdown
url = ${ctx.proto2pkgJson.link}
classifiers =
    Programming Language :: Python :: 3
    Operating System :: OS Independent

[options]
package_dir =
    = src
packages = find:
python_requires = >=3.6

[options.packages.find]
where = src
`);