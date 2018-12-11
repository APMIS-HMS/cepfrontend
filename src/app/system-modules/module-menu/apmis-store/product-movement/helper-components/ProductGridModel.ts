export interface ProductGridModel
{
    availableQuantity? : number  ; 
    price? : number ; 
    unitOfMeasure? : string ; 
    productId? : string  ; 
    productName? : string;
    totalQuantity? : number;
    qtyOnHold? : any;  // totalQuantity - availableQuantity
    reorderLevel? : number;
    size? : number
    _id? : string;
     qtyToSend? : number;
     isNew? :boolean;
}

export interface StoreOutbound {
    product
}