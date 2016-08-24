export interface PluginContext {
    dirname?: string;
    generateImportsService?: Function;
    generateImportsMessage?: Function;
    primitiveTypes?: string[];
    dustTemplate?: Function;
}
export interface PluginModule {
    __esModule: any;
    default: any;
}
export interface Plugin {
}
export declare function normalisePlugin(plugin: string | PluginModule | Plugin, dirname: string, context?: PluginContext): any;
