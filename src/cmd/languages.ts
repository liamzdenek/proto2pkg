import {command} from "cmd-ts";
import {builders} from "../builders";
import {getSupportedLanguages} from "../util/getSupportedLanguages";

export const languages = command({
    name: 'languages',
    description: 'list all of the supported languages',
    args: {},
    handler: async args => {
        let langs = getSupportedLanguages();
        console.log("Languages: ")
        for(let lang of Object.values(langs)) {
            console.log("*", lang);
        }
    }
});