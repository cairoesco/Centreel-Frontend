import { Injectable } from '@angular/core'
import { ApiService } from '../api.service';

declare global {
    interface Navigator {
      msSaveBlob?: (blob: any, defaultName?: string) => boolean;
      msSaveOrOpenBlob: (blob: Blob) => void;
    }
  }
  
@Injectable()
export class ReportService {
    constructor(private webApi: ApiService) { }

    getCogsReport(data) {
        return this.webApi.get("reports/cogs?" + data);
    }
    getTaxReport(data) {
        return this.webApi.get('reports/taxes', data)
    }
    exportReport(url, data) {
        return this.webApi.getExportPDF('reports/' + url, data)
    }
    getStores() {
        return this.webApi.get('store/settings/create')
    }
    getInventoryData(params?) {
        return this.webApi.get('reports/inventory-on-hand',params)
    }
    getTills(param) {
        return this.webApi.get('tills', param)
    }
    getWarehouse() {
        return this.webApi.get('warehouse', { 'status': 1 })
    }
    getProductTypes() {
        return this.webApi.get('productTypes', { 'product_type_status': 1 })
    }
    getCategory(event) {
        return this.webApi.get('productCategories', { type_id: event.value })
    }
    getSalesReport(data) {
        return this.webApi.get('reports/sales/categories', data)
    }
    getTopsellingReport(data) {
        return this.webApi.get('reports/topsellings', data)
    }
    getRVCReport(data) {
        return this.webApi.get('reports/rvc', data)
    }
    getCashoutReport(data) {
        return this.webApi.get('reports/cashout', data)
    }
    getStockTransferReport(data) {
        return this.webApi.get('reports/stocktransfer', data)
    }
    getWasteReport(data) {
        return this.webApi.get('reports/waste', data)
    }
    /* get time sheet report */
    getTimesheetReport(data) {
        // return this.webApi.get('reports/users/timesheet', data)
        return this.webApi.get('reports/users/timesheet?'+data)
    }
    /* get time sheet report */

    /* get time sheet export report */
    timesheet_exportReport(data) {
        // return this.webApi.getExportPDF('reports/users/timesheet?' +data)
        return this.webApi.getExportPDF('reports/exports/timesheet?' +data)
    }
    /* get time sheet export report */

    /* get time tracking report */
    getTimesheetEmployeeReport(data) {
        // return this.webApi.get('reports/users/index', data)
        return this.webApi.get('reports/users/index?'+data)
    }
    /* get time tracking report */
    getOrdersReport(data) {
        return this.webApi.get('reports/orderslist', data)
    }
    /* custom sales report */
    getCustomsalesReport(data) {
        return this.webApi.get('reports/sales', data)
    }
    getReportDetails(report_id) {
        return this.webApi.get('reports/sales/' + report_id + '/edit')
    }
    getSalesReportFilterData() {
        return this.webApi.get('reports/sales/create')
    }
    deleteReport(data) {
        return this.webApi.deletes('reports/sales', data)
    }
    /* custom sales report */

    /* reconcile history */
    getFilterList() {
        return this.webApi.get('reports/reconcileInventory/create')
    }
    getReconcileHistoryReport(data){
        return this.webApi.get('reports/reconcileInventory?'+data)
    }
    reconcile_exportReport(data) {
        return this.webApi.getExportPDF('reports/exports/inventory-reconcile?' +data)
    }
    /* reconcile history */

    /* refund report */

    getRefundReportStores() {
        return this.webApi.get('reports/refund/create')
    }

    getRefundReport(data) {
        return this.webApi.get('reports/refund?'+data)
    }

    refund_exportReportPdf(data) {
        return this.webApi.getExportPDF('reports/refund/refundReportpdf?' +data)
    }   

    refund_exportReportCsv(data) {
        return this.webApi.getExportPDF('reports/refund/refundReportcsv?' +data)
    }    
    /* refund report */

    /* inventory audit report */
    getInventoryAuditReport(data){
        return this.webApi.get('reports/inventoryAudit?'+data)
    }
    inventory_audit_exportReport(data) {
        return this.webApi.getExportPDF('reports/export/inventoryAudit?' +data)
    }
    /* inventory audit report */

    /* Printable menu report */
    getPrintableMenuReport(data){
        return this.webApi.get('reports/inventoryPrintableMenu?'+data)
    }
    getBrandSalesReport(data) {
        return this.webApi.get(`dashboard/soldProductBrand/Index${data}`);
    }
    getLowSalesReport(data) {

        let tz = new Date().toTimeString().slice(9).substring(3, 8);
        tz = `${tz.slice(0, 3)}:${tz.substring(3, 5)}` 
        return this.webApi.get(`reports/lowSale/index?time_zone=${tz}${data}`);
      }
    
      exportLowSalesReport(data) {
        return this.webApi.get(`reports/lowSale/export${data}`);
      }

    printableMenu_exportReport(data) {
        return this.webApi.getExportPDF('reports/export/inventoryPrintableMenu?' +data)
    }
    getEmployeeSalesReport(data) {
       return this.webApi.get("reports/employeeSales?" + data);
    }

    exportBrandSalesReport(data) {
        return this.webApi.get(`dashboard/soldProductBrand${data}`);
    }
    exportEmployeeSalesReport(url) {
        return this.webApi.getExportPDF("reports/" + url,);
    }

    downloadFile(data: any, type, report_name = null) {
        let blob = new Blob([data], { type: type });
        let url = window.URL.createObjectURL(blob);
        let ext;

        switch (type) {
            case 'text/csv':
                ext = '.csv';
                break;
            case 'application/pdf':
                ext = '.pdf';
                break;
            case 'application/vnd.ms-excel':
                ext = '.xls';
                break;
        }

        if(report_name != null){
            var filename = report_name + ext;
        }else{
            var filename = +(new Date()) + ext;
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