/* eslint-disable @typescript-eslint/no-explicit-any */
function diffObject(comA: any, comB: any) {
    const diffResult: Record<string, string> = {};

    for (const key in comA) {
        if (comA[key] !== comB[key]) {
            Object.assign(diffResult, { [key]: comA[key] })
        }
    }

     return diffResult;
}

export default diffObject;