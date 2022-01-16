import {BuildContext} from "../../Builder";
import {TsProtoBuilderConfig} from "./index";
import {generateReadmeText} from "../../../util/generateReadme";
import {Enum, Field, Method, Namespace, Service, Type} from "protobufjs";
import {typeName} from "ts-json-schema-generator/dist/src/Utils/typeName";
import * as path from 'path';

export const getServerStub = (ctx: BuildContext, cfg: TsProtoBuilderConfig) => {
    const services = getServiceList(ctx);
    if (services.length === 0) {
        return "The proto file contains no services, so it's not possible to implement a server."
    }
    return (
        `\`\`\`ts
${getServiceServerStub(ctx, cfg, services)}
\`\`\`
`);
}

export const getServiceServerStub = (ctx: BuildContext, cfg: TsProtoBuilderConfig, services: Service[]) => (
`import {ServiceImplementation} from 'nice-grpc';
${importTableToStr(getImports(ctx, services))}
import {
    DeepPartial,
} from '${ctx.thisBuildContext.packageName}/main';

${services.map(service => (
`const ${service.name}Impl: ServiceImplementation<
    typeof ${service.name}Definition
> = {
${getServiceMethods(ctx, service).map(method => (
`    async ${method.responseStream ? "*" : ""}${method.name}(
        request: ${wrapTypeIfClientStreaming(getTypeVarName(ctx, method.resolvedRequestType), method)},
    ): ${method.responseStream ? "AsyncIterable" : "Promise"}<DeepPartial<${getTypeVarName(ctx, method.resolvedRequestType)}>> {
        ${method.requestStream ? 
        `for await (const item of request) {
            // ... method logic
        }` : `// ... method logic`}
        const response = ${addIndents(2, mockInstantiateType(ctx, method.responseType, method.resolvedResponseType))}
        ${method.responseStream ? "yield" : "return"} response;
    },
`)).join("")}
};
`)).join("\n")}


const server = createServer()/*.useMiddleware(middleware)*/;

// you may implement multiple services within the same process/port, depending on your application architecture
${services.map(service => (
`server.add(${service.name}Definition, ${service.name}Impl);`
)).join("\n")}

await server.listen('0.0.0.0:8080');

process.on('SIGINT', async () => {
    await server.shutdown();
    process.exit();
});
`);


export const wrapTypeIfClientStreaming = (tsType: string, method: Method): string => {
    if(method.requestStream) {
        return `AsyncIterable<${tsType}>`;
    }
    return tsType;
}
export const wrapTypeIfServerStreaming = (tsType: string, method: Method): string => {
    if(method.responseStream) {
        return `AsyncIterable<${tsType}>`;
    }
    return tsType;
}

type ImportTable = {[file: string]: Set<string>};

export const getImports = (ctx: BuildContext, services: Service[]): ImportTable => {
    let importTable: ImportTable = {};
    const push = (key: string, val: string) => {
        if(!(key in importTable)) {
            importTable[key] = new Set();
        }
        console.log("import=",key,"varName=",val);
        importTable[key].add(val);
    }

    for(let service of services) {
        let importName = getTypeImport(ctx, service);
        push(importName, service.name+"Definition");

        for(let method of getServiceMethods(ctx, service)) {
            for(let type of [method.resolvedRequestType, method.resolvedResponseType]) {
                let importName = getTypeImport(ctx, type);
                let varName = getTypeVarName(ctx, type);
                push(importName, varName);
            }
        }
    }
    return importTable;
}

export const importTableToStr = (table: ImportTable): string => (Object.entries(table).map(entry => (
`import {
    ${addIndents(1,Array.from(entry[1].values()).join(",\n"))}
} from "${entry[0]}";`
)).join("\n"));

export const getTypeVarName = (ctx: BuildContext, type: Type | null): string => {
    if(type === null) {
        return "void";
    }
    return type.name;
}

export const getTypeImport = (ctx: BuildContext, type: Service | Type | null): string => {
    if(type === null) {
        return `${ctx.thisBuildContext.packageName}/???`;
    }
    return ctx.thisBuildContext.packageName+"/"+(type.filename || "")
        .replace(path.join(ctx.sourceDir, "/src/"), "")
        .replace(".proto", "");
}

export const mockInstantiateType = (ctx: BuildContext, typeName: string | null, type: Type | Enum | null): string => {
    //console.log("MOCK", typeName, type)

    if(typeName === null) {
        return "null";
    }
    if(typeName === "string") {
        return `"" /* string */`;
    }
    if(typeName === "bool") {
        return `false /* bool */`;
    }
    if(["double", "float", "int32", "int64", "uint32", "uint64", "sint32", "sint64", "fixed32", "fixed64", "sfixed32", "sfixed64"].includes(typeName)) {
        return `0 /* ${typeName} */`;
    }
    if(typeName === "bytes") {
        return `new Buffer("") /* bytes */`;
    }
    if(type === null) {
        return `null /* couldn't identify type: ${typeName} */`;
    }
    if(type instanceof Enum) {
        console.log("ENUM", type);
        const values = Object.keys(type.values);
        return `${type.name}.${values.length > 0 ? values[0] : "UNRECOGNIZED"} /* variants: ${values.join(", ")} */`;
        //UNRECOGNIZED
    }
    if(type instanceof Type) {
        let s = "{\n";
        for(let [fieldName, field] of getTypeFields(ctx, type)) {
            s += `    "${fieldName}": ${addIndents(1, mockInstantiateType(ctx, field.type, field.resolvedType))},\n`;
        }
        s += "}";
        return s;
    }
    //console.log('type', type);
    return "null /* unknown type ${typeName} */";
}

export const getTypeFields = (ctx: BuildContext, method: Type): [string, Field][] => {
    return Object.entries(method.fields).map(field => {
        field[1].resolve();
        console.log('resolved type', field[1].type);
        return field;
    })
}

export const getServiceList = (ctx: BuildContext): Service[] => {
    let ret = [];

    //console.log("proto root", ctx.protoRoot);

    for(let type in ctx.protoRoot.nested) {
        const nestedType = ctx.protoRoot.nested[type];
        //const nestedType = ctx.protoRoot.get(type);

        if(nestedType instanceof Service) {
            ret.push(nestedType);
        }

        if(nestedType instanceof Namespace) {
            console.log('namespace', nestedType);
            ret.push(...getServicesFromNamespace(nestedType));
        }
    }

    return ret;
}

export const getServicesFromNamespace = (ns: Namespace): Service[] => {
    let ret: Service[] = [];
    for(let nestedType of ns.nestedArray) {
        if(nestedType instanceof Service) {
            ret.push(nestedType);
        }

        if(nestedType instanceof Namespace) {
            ret.push(...getServicesFromNamespace(nestedType));
        }
    }

    return ret;
}

export const getServiceMethods = (ctx: BuildContext, service: Service): Method[] => {
    console.log('method response type', Object.values(service.methods)[0].resolvedResponseType)
    return Object.values(service.methods).map(method => {
        method.resolve();
        return method;
    })
}

export const addIndents = (count: number, str: string): string => {
    return str.replace(/^/gm, `    `.repeat(count)).trim();
}