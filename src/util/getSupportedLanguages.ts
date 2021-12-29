import {builders} from "../builders";

export enum Languages {
    Typescript = "typescript",
    Javascript = "javascript",
    GrpcWeb = "grpc-web",
    Python3 = "python3"
}

export const getSupportedLanguages = (): typeof Languages => Languages;/*Object.values(builders)
    .map(builder => builder.languages)
    .reduce((acc, langs) => {
        for(let lang of langs) {
            acc.add(lang);
        }
        return acc;
    }, new Set());
*/