import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
const API_URL = environment.baseUrl + "api/";

@Injectable()
export class ApiService {

    constructor(private http: HttpClient) { }

    getAccessToken({ username, password }) {
        let postData = {
            grant_type: "password",
            client_id: environment.client_id,
            client_secret: environment.client_secret,
            username: username,
            password: password,
            scope: "",
            provider: "users",
            platform: "WEB",
        }
        return this.http.post(API_URL + 'signin', postData);
    }

    public get(actionUrl: string, params: any = null): Observable<any[]> {
        return this.http.get<any[]>(API_URL + actionUrl, {
            params: params
        });
    }

    public post(actionUrl: string, itemName: any): Observable<any[]> {
        return this.http.post<any[]>(API_URL + actionUrl, itemName);
    }

    public deletes(actionUrl: string, id: number): Observable<any[]> {
        return this.http.delete<any[]>(API_URL + actionUrl + '/' + id);
    }

    /* for export functionality */
    public getExportPDF(actionUrl: string, params: any = null) {
        return new Promise((resolve, reject) => {
            this.http
                .get(API_URL + actionUrl, { responseType: "blob", observe: 'response', params })
                .subscribe(
                    res => {
                        resolve(res);
                    },
                    err => {
                        reject(err);
                    }
                );
        });
    }
    public getExportPDFPost(actionUrl: string, params: any = null) {
        return new Promise((resolve, reject) => {
            this.http
                .post(API_URL + actionUrl,params,  {responseType: "blob", observe: 'response'} )
                .subscribe(
                    res => {
                        console.log(res);                        
                        resolve(res);
                    },
                    err => {
                        console.log(err,'error');
                        reject(err);
                    }
                );
        });
    }
}
