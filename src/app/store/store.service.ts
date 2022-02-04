
import { Injectable } from '@angular/core'
import { ApiService } from '../api.service';

@Injectable()
export class StoreService {
    constructor(private webApi: ApiService) { }

    GetStoreList() {
        return this.webApi.get('stores')
    }

    getChainList() {
        return this.webApi.get('chains')
    }

    getLocationList(type, parent_id) {
        return this.webApi.get('location?location_type=' + type + '&parent_id=' + parent_id);
    }

    createStore(data) {
        return this.webApi.post('stores', data)
    }
    getStoreDetailById(storeId) {
        return this.webApi.get('stores/' + storeId);
    }
    addTages(data) {
        return this.webApi.post('tags', data)
    }

    updateStore(storeId, data) {
        return this.webApi.post('stores/' + storeId, data)
    }

    getStoreRawData() {
        return this.webApi.get('stores/create');
    }

    deleteStoreTiming(id) {
        return this.webApi.deletes('stores/deleteTime', id)
    }

    deleteDocument(documentId, params) {
        return this.webApi.post('documents/' + documentId, params)
    }

    

    
    markAsClose(id, data) {
        return this.webApi.post('stores/'+id+'/markClose', data)
    }
}