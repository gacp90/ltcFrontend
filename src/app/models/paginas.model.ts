import { Product } from "./products.model";
import { User } from "./users.model";

export class Pagina{
    constructor(
        public total: number,
        public copia: number,
        public scaner: number,
        public qty: number,
        public qtys: number,
        public qtyc: number,
        public img: string,
        public product: Product,
        public staff: User,
        public fecha: Date,
        public paid: string,
        public _id: string,
    ){}
}