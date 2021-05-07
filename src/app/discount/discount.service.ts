import { Injectable } from '@angular/core'
import { ApiService } from '../api.service';

@Injectable()
export class DiscountService {
    constructor(private webApi: ApiService) { }

    GetStores() {
        return this.webApi.get('stores')
    }
    GetDiscountList(store_id) {
        return this.webApi.get(`discounts?store_id=${store_id}`)
    }
    DeleteDiscount(discountId) {
        return this.webApi.deletes('discounts', discountId)
    }
    AddNewDiscount(payload) {
        return this.webApi.post('discounts', payload)
    }
    changeDiscountStatus(discountId, status) {
        return this.webApi.put(`discounts/${discountId}`, status)
    }
    GetAddDiscountData() {
        return this.webApi.get(`discount/addDiscountdata`)
    }
    /* for filter result */
    GetDiscountFilterData() {
        return this.webApi.get(`discount/getfilterdata`)
    }
    GetDiscountFilterList(payload) {
        return this.webApi.get(`discount/getfilteredlist`, payload)
    }
}