export const camelToSnakeCaseDashes = (str: string) => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
export const camelToSnakeCaseUnderscores = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

export const snakeToCamelCase = (str: string) =>
    str.toLowerCase().replace(/([-_][a-z])/g, group =>
        group
            .toUpperCase()
            .replace('-', '')
            .replace('_', '')
    );

export const normalizeToCamelCase = (str: string) => {
    // if the string starts with upper case or includes a dash, it's snake case.
    if(str[0] === str[0].toUpperCase() || str.includes("-")) {
        return snakeToCamelCase(str);
    }
    return str;
}
