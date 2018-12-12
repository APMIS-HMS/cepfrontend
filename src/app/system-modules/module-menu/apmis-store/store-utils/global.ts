export const Filters = {
    All: 'All',
    ToExpire: 'Expire: This Week',
    Expired: 'Expired',
    BelowReOrder: 'Below Re-Order Level',
    OutOfStock: 'Out of Stock',
    HighConsumptionRate: 'High Consumption Rate'
};

export const ProductsToggle = {
    All: 'All',
    Drug: 'Drug',
    Consumables: 'Consumables'
};
export interface FormularyProduct {
    code: string;
    id: string;
    name: string;
}
export interface ProductPackSize {
    id: string;
    label: string;
    size: number;
}
export interface ProductConfig {
    _id?: string;
    productId: string;
    productObject: FormularyProduct;
    facilityId: string;
    rxCode: string;
    packSizes: any[];
}
