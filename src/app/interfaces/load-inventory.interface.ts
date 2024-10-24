import { Inventory } from "../models/inventory.model";


export interface LoadInventory{
    ok: boolean,
    products: Inventory[],
    total: number
}