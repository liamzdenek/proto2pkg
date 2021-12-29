import { Type } from 'cmd-ts';

/*
export const StringList: Type<string,Set<string>> = {
    async from(str) {
        let res = new Set<string>();
        for(let substr in str.split(",")) {
            res.add(substr);
        }
        return res;
    }
}
 */

type EnumType = {
    [k: string]: any
}

export const generateEnumListType = <T extends EnumType>(t: T): Type<string, Set<T>> => ({
    async from(str) {
        let res = new Set<T>();
        for(let substr of str.split(",")) {
            let lang: T[keyof T] = Object.values(t).find(v => v === substr);
            if(!lang) {
                throw new Error("Couldn't map field '"+substr+"' to enum type '"+Object.values(t)+"'");
            }
            res.add(lang);
        }
        return res;
    }
})