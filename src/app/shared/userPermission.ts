import { Injectable } from '@angular/core';

@Injectable()
export class userPermission {
    /********************** Define permission roles for routes **********************/
    public static permissionRole = {

        // types
        product_edit: { module: "products", slug: "add_product_type" },
        product_create: { module: "products", slug: "update_product" },
        // product_create:"update_product"


    };
    /********************************************************************************/
    constructor() { }
}
