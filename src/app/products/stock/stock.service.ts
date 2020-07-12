import { Injectable } from '@angular/core'
import { ApiService } from '../../api.service';

@Injectable()
export class StockService {
    constructor(private webApi: ApiService) { }

    getProductStockList(data) {
        return this.webApi.get('stocks',data)
    }
    getProductVariantsStockList(product_id,data) {
        return this.webApi.get('stocks/' + product_id,data)
    }
    getVendorList() {
        return this.webApi.get('stocks/create')
    }
    addStock(data) {
        return this.webApi.post('stocks', data)
    }
    transferStock(data) {
        return this.webApi.post('transfers', data)
    }
    getBatchList(data){
        return this.webApi.get('stocks/create', data)
    }
    reconcileStock(data){
        // return this.webApi.post('stocks/reconcile', data)
        return this.webApi.post('reports/inventory/reconcile',data)
    }
    getStockHistory(data){
        return this.webApi.get('stockHistory',data);
    }
    /* for po search */
    getPoDetails(param) {
        return this.webApi.get('purchaseReceive',param)
    }
    /* for po search */

    /* get thc cbd data */
    getBatchDetails(vid, param) {
        return this.webApi.get('variantBatch/'+vid,param)
    }
    /* get thc cbd data */
}