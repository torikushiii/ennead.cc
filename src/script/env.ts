export function getEnv(locals: App.Locals, metaEnv: ImportMetaEnv, name: string) {
    // @ts-ignore
    const env = import.meta.env.PROD ? locals.runtime.env : metaEnv;
    if (!env[name]) {
        throw new Error(`${name} is not set`);
    }

    return env[name];
}

export function getPublicEnv(metaEnv: ImportMetaEnv, name: string) {
    return metaEnv[name];
}
