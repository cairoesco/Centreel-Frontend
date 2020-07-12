import { Injectable } from '@angular/core'
import { ApiService } from '../api.service';

@Injectable()
export class UserService {
    constructor(private webApi: ApiService) { }

    GetUserList() {
        return this.webApi.get('users')
    }
    DeleteUser(userId) {
        return this.webApi.deletes('user/deletes', userId)
    }
    AddEmployee(employeeDetails) {
        return this.webApi.post('users', employeeDetails)
    }
    getRawDetail() {
        return this.webApi.get('users/create');
    }
    getLocationList(type, parent_id) {
        return this.webApi.get('location?location_type=' + type + '&parent_id=' + parent_id);
    }
    getUserDetailById(user_id) {
        return this.webApi.get('users/' + user_id);
    }
    EditEmployee(employeeDetails, user_id) {
        return this.webApi.post('users/' + user_id, employeeDetails)
    }
    deleteDocument(documentId, params) {
        return this.webApi.post('documents/' + documentId, params)
    }
    changeUserStatus(userId, status) {
        return this.webApi.post('users/' + userId +'/status',status)
    }
    addTages(data) {
        return this.webApi.post('tags',data)
    }
    sendVerification(data) {
        return this.webApi.post('forgotPassword' ,data)
    }
    /* shift delete */
    deleteShiftTiming(id) {
        return this.webApi.deletes('users/deleteShiftTime', id)
    }
    /* for filter result */
    GetUserFilterList(param) {
        return this.webApi.get('users',param)
    }
    /* reset pin or password */
    resetData(userData) {
        return this.webApi.post('resetPassword', userData)
    }
}