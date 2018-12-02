export const Filters = {
    All: 'All',
    ToExpire: 'Expire: This Week',
    Expired: 'Expired',
    BelowReOrder: 'Below Re-Order Leve',
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
    _id: string;
    name: string;
}
