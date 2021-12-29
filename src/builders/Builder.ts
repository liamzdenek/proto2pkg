import {Languages} from "../util/getSupportedLanguages";

export interface Builder {
    packageNameStyle: PackageNameStyle;
    languages: (Languages)[];
    checkPrerequisites: { (ctx: BuildContext): Promise<Error[]> }
    generatePackage: { (ctx: BuildContext): Promise<BuildResult> }
}

export enum PackageNameStyle {
    CamelCase = "CamelCase",
    SnakeCaseDashes = "snake-case-dashes",
    SnakeCaseUnderscores = "snake_case_underscores"
}

export interface BuildResult {
    errors: Error[]
}

export interface BuildContext {
    sourceDir: string;
    sharedDistDir: string;
    commitHash: string | null;
    buildTime: Date,
    proto2pkgJson: Proto2PkgJson;
    thisBuildContext: ThisBuildContext;
}

export interface Proto2PkgJson {
    name: string;
    version: string;
    link: string;
}

export interface ThisBuildContext {
    distDir: string;
    packageName: string;
    builderName: string;
}