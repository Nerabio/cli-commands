export interface JsonScheme {
    filePath: string;
    imports?: string[];
    exports?: string[];
    checksum?: string;
    source: string;
}