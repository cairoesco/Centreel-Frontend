import { Injectable } from '@angular/core'
import { ApiService } from '../api.service';

@Injectable()
export class ProductService {
    constructor(private webApi: ApiService) { }
    rawDetailsProducts() {
        return this.webApi.get('products/create')
    }
    getProvinceList() {
        return this.webApi.get('location?location_type=state&parent_id=1')
    }
    getCityList(parent) {
        return this.webApi.get('location?location_type=city&parent_id=' + parent)
    }
    GetProductList(param) {
        return this.webApi.get('products', param)
    }
    productStatusChange(status) {
        return this.webApi.post('variants/status', status)
    }
    createProduct(data) {
        return this.webApi.post('products', data)
    }
    updateProduct(data, product_id) {
        return this.webApi.post('products/' + product_id, data)
    }
    updateVariant(data, variant_id) {
        return this.webApi.post('variants/' + variant_id, data)
    }

    addTages(data) {
        return this.webApi.post('tags', data)
    }

    getProductById(product_id) {
        return this.webApi.get('products/' + product_id + '/edit')
    }

    deleteProductVariant(param) {
        return this.webApi.post('variants/delete', param)
    }
    getVariantList(params){
        return this.webApi.get('variants',params)
    }
    getVariantDetail(variant_id){
        return this.webApi.get('variants/'+variant_id)
    }
    addSupplier(data) {
        return this.webApi.post('suppliers', data)
    }
    viewSupplier(data,id) {
        return this.webApi.post('suppliers/'+id, data)
    }
    getStores() {
        return this.webApi.get('stocks/create')
    }
    getStoresList() {
        return this.webApi.get('store/settings/create')
    }
    getInventoryData(params?) {
        return this.webApi.get('reports/inventory-on-hand',params)
    }
    reconsileInventoryData(data) {
        return this.webApi.post('reports/inventory/reconcile',data)
    }
    /* print barcode */
    printBarcode(variant_id,data) {
        return this.webApi.getExportPDFPost('purchaseReceive/'+variant_id+'/productBarcodePDF', data)
    }
    /* print barcode */
}