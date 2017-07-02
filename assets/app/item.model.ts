export class Item {
    constructor(public name: string, 
                public desc: string, // public - nie musimy deklarowac pola klasy
                public dataFrameId?: string, // ? == optional
                public descFrameId?: string) {}
}