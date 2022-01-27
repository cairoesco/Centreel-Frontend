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

    editCustomer(patient_id, params) {
        return this.webApi.post(`patients/${patient_id}`, params)
    }
    getRawDetail() {
        return this.webApi.get('users/create');
    }
    getLocationList(type, parent_id) {
        return this.webApi.get('location?location_type=' + type + '&parent_id=' + parent_id);
    }
    getCustomer(patient_id, store_id){
        return this.webApi.get(`patients/${patient_id}?store_id=${store_id}`)        
    }

    getCustomerPreferredProductList(id) {
        return this.webApi.get('patients/'+id+'/product')
    }
    GetStores() {
        return this.webApi.get('stores')
    }
    updateCustomerQueue(queue_status, customer_id, store_id) {
        return this.webApi.post(`patients/${customer_id}/updateQueueStatus?queue_status=${queue_status}&store_id=${store_id}`, {})
    }
    getCustomerQueueList(store_id) {
        return this.webApi.get(`patient/queuePatient?store_id=${store_id}`,)
    }
    filterCustomerQueue(params) {
        return this.webApi.get(`patients`, params)
    }


}