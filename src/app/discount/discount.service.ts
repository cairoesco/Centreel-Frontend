import { Injectable } from '@angular/core'
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';

@Injectable()
export class PurchaseOrderService {
    constructor(private webApi: ApiService) { }
    createDiscount(data) {
        return this.webApi.post('discount', data)
    }
    getStoreList() {
        return this.webApi.get('store/settings/create')
    }
    deleteDiscount(discountId) {
        return this.webApi.deletes('purchaseReceiveDraft',discountId)
    }

}