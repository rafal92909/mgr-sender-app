export class Item {
    constructor(public name: string, 
                public desc: string, // public - nie musimy deklarowac pola klasy
                public itemId: string,
                public il?:boolean) {}
}