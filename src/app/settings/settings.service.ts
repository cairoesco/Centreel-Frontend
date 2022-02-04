import { Injectable } from '@angular/core'
import { ApiService } from '../api.service';

@Injectable()
export class SettingsService {
    constructor(private webApi: ApiService) { }

    getMailConfiguration() {
        return this.webApi.get('mailConfiguration')
    }
    storeMailConfiguration(data) {
        return this.webApi.post('mailConfiguration', data)
    }
    /* tax setting */
    getchainData() {
        return this.webApi.get('chain/settings/create')
    }
    gettaxData(cid) {
        return this.webApi.get('chain/settings/'+cid)
    }
    taxformData(data) {
        return this.webApi.post('chain/settings', data)
    }
    /* tax setting */
    storeAgreement(data) {
        return this.webApi.post('agreements', data)
    }
    updateAgreement(id, data) {
        return this.webApi.post('agreements/' + id, data)
    }
    getAgreement(data) {
        return this.webApi.get('agreements/' + data + '/edit')
    }
    getChain() {
        return this.webApi.get('chains')
    }

    // ------------------- Store setting ------------------------
  
    getStoreSettings(id) {
        return this.webApi.get('store/settings/'+id)
    }
    updateStoreSettings(data) {
        return this.webApi.post('store/settings', data)
    }
    getStoreList(){
        return this.webApi.get('store/settings/create')
    }
}