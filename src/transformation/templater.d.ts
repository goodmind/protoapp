import { PluginContext } from './plugin';
export declare function convertType(value: string): string;
export declare function firstLetterInLowerCase(value: string): string;
export declare function hyphenCase(value: string): string;
export declare function camelCase(value: string): string;
export declare function loadDustTemplate(name: string, file?: string, dirname?: string): void;
export declare function renderDustTemplate(name: string, model: any): Promise<any>;
export declare function dustTemplate(this: PluginContext, name: string, model: any): Promise<any>;
export declare const primitiveTypes: string[];
