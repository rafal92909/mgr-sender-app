export class DataFrame {
    constructor(
        public key: string, 
        public type: string, 
        public value: string, 
        public itemId: string,
        public dataFrameId?: string) {}
}