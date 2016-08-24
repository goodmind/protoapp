import { ProtobufMessage, Entity, ProtobufRoot } from '../interfaces';
export interface AST {
    namespaces: string[];
    body: Promise<Entity>[];
}
export default function traverse(acc: AST, node: ProtobufMessage | ProtobufRoot, visitor: any): void;
