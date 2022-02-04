import { Injectable } from '@angular/core'
import { ApiService } from '../api.service';

@Injectable()
export class DashboardService {
    constructor(private webApi: ApiService) { }

    // getDashboard(){
    //     return this.webApi.get('dashboard');
    // }
    getDashboard(data){
        return this.webApi.get('dashboard?'+data.trim());
    }
    getSalesEmployee(data) {
        return this.webApi.get('dashboard/salesEmployee',data);
    }
    getAvgSalesEmployee(data) {
        return this.webApi.get('dashboard/salesAvg',data);
    }
    getPayementTypeData(data) {
        return this.webApi.get('dashboard/paymentType',data);
    }
    getOrdersData(data) {
        return this.webApi.get('dashboard/orders',data);
    }
    getSoldProductData(data) {
        return this.webApi.get('dashboard/soldProduct',data);
    }
}