import { Injectable } from '@angular/core'
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';

@Injectable()
export class PurchaseOrderService {
    constructor(private webApi: ApiService) { }
    createPo(poDetails) {
        return this.webApi.post('purchaseReceive/storeData', poDetails)
    }
    /* save new draft */
    createDraft(poDetails) {
        return this.webApi.post('purchaseReceiveDraft', poDetails)
    }
    /* edit existing draft */
    editDraftPo(poDetails, id) {
        return this.webApi.post('purchaseReceiveDraft/' + id, poDetails)
    }
    editPo(poDetails, id) {
        return this.webApi.post('purchaseReceive/' + id, poDetails)
    }
    getPoDetails(param) {
        return this.webApi.get('purchaseReceive',param)
    }
    getPoDraftlist(param) {
        return this.webApi.get('purchaseReceiveDraft',param)
    }
    deleteDraftPo(poId) {
        return this.webApi.deletes('purchaseReceiveDraft',poId)
    }
    getRawDetails() {
        return this.webApi.get('purchaseReceive/create')
    }
    getPobyId(poId) {
        return this.webApi.get('purchaseReceive/' + poId + '/edit')
    }
    /* view po draft */
    getPoDraftbyId(poId) {
        return this.webApi.get('purchaseReceiveDraft/' + poId + '/edit')
    }
    downloadDocId(docId) {
        return this.webApi.get('documents/download/' + docId)
    }
    deleteDoc(docId, params) {
        return this.webApi.post('documents/' + docId, params)
    }
    purchaseStatus(po_id, data) {
        return this.webApi.post('purchaseReceive/' + po_id + '/status', data)
    }
    getWarehouse() {
        return this.webApi.get('warehouse', { 'status': 1 })
    }
    getSearchResult(data) {
        return this.webApi.post('purchaseReceive/searchProduct', data)
    }
    // getSearchResult(data) {
    //     return this.webApi.get('purchaseReceive/getProduct', data)
    // }
    getSellingPrice(SKU) {
        return this.webApi.post('purchaseReceive/getPriceFromSKU', SKU)
    }
    getBarcodePrint(data) {
        return this.webApi.post('purchaseReceive/create123', data)
    }
    printBarcode(po_id,data) {
        return this.webApi.getExportPDFPost('purchaseReceive/'+po_id+'/generatePDF', data)
    }
    rawDetailsProducts() {
        return this.webApi.get('products/create')
    }
    //create product within manually po
    createProduct(data) {
        return this.webApi.post('products', data)
    }

    /* check po num exist or not */
    isExist(data): Observable<any>{
        // return this.http.post<string>
        return this.webApi.post('purchaseReceive/checkValidation', data);
    }
    /* check po num exist or not */
    /* get thc cbd data */
    getBatchDetails(vid, param) {
        return this.webApi.get('variantBatch/'+vid,param)
    }
    /* get thc cbd data */
    

}