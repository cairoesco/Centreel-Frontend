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
        return this.webApi.put(`patients/${patient_id}`, params)
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
    customerListExportReport(params) {
        return this.webApi.getExportPDF(`reports/customerList/export?${params}`)
      }
    
    downloadFile(data: any, type, report_name = null) {
        let blob = new Blob([data], { type: type });
        let url = window.URL.createObjectURL(blob);
        let ext;
    
        switch (type) {
          case "text/csv":
            ext = ".csv";
            break;
          case "application/pdf":
            ext = ".pdf";
            break;
          case "application/vnd.ms-excel":
            ext = ".xls";
            break;
        }
    
        if (report_name != null) {
          var filename = report_name + ext;
        } else {
          var filename = +new Date() + ext;
        }
    
        if (navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, filename);
        } else {
          var a = document.createElement("a");
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        window.URL.revokeObjectURL(url);
    }

}