export class DataFramePart {
    constructor(
        public key: string, 
        public type: string, 
        public value: string, 
        public itemId: string,
        public descFramePart: string, 
        public dataFrameId?: string) {}
}