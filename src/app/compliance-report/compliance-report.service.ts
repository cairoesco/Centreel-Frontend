
import { Injectable } from '@angular/core'
import { ApiService } from '../api.service';

@Injectable()
export class ComplianceReportService {
    constructor(private webApi: ApiService) { }

 
    getLocationList(type, parent_id) {
        return this.webApi.get('location?location_type=' + type + '&parent_id=' + parent_id);
    }
    exportExcel(params) {
        return this.webApi.getExportPDF('reports/cannabispdf',params);
    }
    getCannabiesStores() {
        return this.webApi.get('reports/cannabis');
    }

    
}