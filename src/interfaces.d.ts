export interface ProtobufServiceRpc {
    request: string;
    response: string;
    options: {
        [s: string]: string | any;
    };
}
export interface ProtobufService {
    name: string;
    options: any;
    rpc: {
        [s: string]: ProtobufServiceRpc;
    };
}
export interface ProtobufMessage extends ProtobufNode {
    name: string;
    _parent?: ProtobufNode;
}
export interface ProtobufRoot extends ProtobufNode {
    package: string;
}
export interface ProtobufNode {
    fields: {
        rule: string;
        type: string;
        name: string;
        id: number;
        oneof?: string;
    }[];
    messages?: ProtobufMessage[];
    services?: ProtobufService[];
}
export interface File {
    filename: string;
    body: string;
}
export interface Entity {
    type: string;
    files: File[];
}
