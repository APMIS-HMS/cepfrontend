export interface    IStoreSummaryItem
{
    key : string;
    value? : string | number;
    values?  : KeyValue[];
    method? : string ;
    relativeUrl? : string;
    /*This fields are for UI customization*/
    tag? : string ;
    tagColor? :  string;
    query? : any;
    getId? : number |string;
}
export interface KeyValue {
    key? : string;
    value? : string | number;
}

/*
*   "key": "Out of Stock",
            "values": [
                {
                    "key": "Batches",
                    "value": 0
                }
            ],
            "method": "get",
            "getId": 0,
            "query": {
                "params": {
                    "storeId": "5b0282ad3d853313d0cb3217"
                }
            },
            "hex": "#581845",
            "rgb": "rgb(88,24,69)",
            "url": "out-of-stock-count-details"
        }
* */
