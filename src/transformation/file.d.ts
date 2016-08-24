import { ProtobufRoot } from '../interfaces';
import { AST } from './traverse';
export default class File {
    private opts;
    ast: ProtobufRoot | AST;
    pluginVisitor: any;
    visitor: any;
    constructor(opts?: any);
    addAst(ast: ProtobufRoot): void;
    transform<T>(): Promise<T[]>;
    generate<T>(): Promise<T[]>;
}
