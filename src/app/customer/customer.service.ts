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
    getRawDetail(){
        return this.webApi.get('patients/create')        
    }

    getCustomerPreferredProductList(id) {
        return this.webApi.get('patients/'+id+'/product')
    }

}