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
    GetSingleDiscount(discount_id) {
        return this.webApi.get(`discounts/${discount_id}`)
    }
    DeleteDiscount(discountId) {
        return this.webApi.deletes('discounts', discountId)
    }
    updateDiscount(discountId, payload){
        return this.webApi.put(`discounts/${discountId}`, payload)
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
    GetProductDryWeightData(data) {
        return this.webApi.get(`discount/getProductDryWeight?product_cat_id=${JSON.stringify(data)}`)
    }
    /* for filter result */
    GetDiscountFilterData() {
        return this.webApi.get(`discount/getfilterdata`)
    }
    GetDiscountFilterList(payload) {
        return this.webApi.get(`discount/getfilteredlist`, payload)
    }
}