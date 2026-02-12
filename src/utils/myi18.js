import arabicLocal from "../local/index.js";

export default function t(key) {
    const result = key
        .split(".")
        .reduce((obj, k) => obj?.[k], arabicLocal);
    if (result === undefined) {
        throw new Error(`Translation not found: ${key}`);
    }

    return result;
}