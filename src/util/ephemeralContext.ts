import {BuildContext} from "../builders";

export const getEphemeralContext = (contextName: string) => ({thisBuildContext: {builderName: contextName}} as BuildContext);