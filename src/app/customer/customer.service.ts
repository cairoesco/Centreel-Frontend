import { Injectable } from '@angular/core'
import { ApiService } from '../api.service';

@Injectable()
export class CustomerService {
    constructor(private webApi: ApiService) { }
    addTages(data) {
        return this.webApi.post('tags', data)
    }
    GetCustomerList(params) {
        return this.webApi.get('patients', params)
    }
    AddCustomer(params) {
        return this.webApi.post('patients', params)
    }
    getRawDetail(){
        return this.webApi.get('users/create')        
    }
    getLocationList(type, parent_id) {
        return this.webApi.get('location?location_type=' + type + '&parent_id=' + parent_id);
    }
    getCustomerPreferredProductList(id) {
        return this.webApi.get('patients/'+id+'/product')
    }

}