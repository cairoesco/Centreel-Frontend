import { Injectable } from '@angular/core'
import { ApiService } from '../api.service';

@Injectable()
export class TagManagementService {
    constructor(private webApi: ApiService) { }
    getTags() {
        return this.webApi.get('tags')
    }
    editTagStatus(id, params){
        return this.webApi.post(`tags/${id}/status`, params)
    }
    updateTag(params){
        return this.webApi.post(`tags/update`, params)
    }
    getTagEntities(id){
        return this.webApi.get(`tags/${id}/edit`)
    }
    getAllEntities(params){
        return this.webApi.post(`tags/sourceData?type=${params}`, params)
    }
    // GetCustomerList(params) {
    //     return this.webApi.get('patients', params)
    // }
    // AddCustomer(params) {
    //     return this.webApi.post('patients', params)
    // }
    // getRawDetail() {
    //     return this.webApi.get('users/create');
    // }
    // getLocationList(type, parent_id) {
    //     return this.webApi.get('location?location_type=' + type + '&parent_id=' + parent_id);
    // }
    // getCustomer(patient_id, store_id){
    //     return this.webApi.get(`patients/${patient_id}?store_id=${store_id}`)        
    // }

    // getCustomerPreferredProductList(id) {
    //     return this.webApi.get('patients/'+id+'/product')
    // }

}