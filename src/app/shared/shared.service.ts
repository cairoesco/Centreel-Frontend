import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Router, NavigationEnd } from '@angular/router';

@Injectable()
export class SharedService {

    //permission:boolean=false;
    permission: any[] = [];
    routePermission = {
        module: "",
        permission_slug: []
    };

    private previousUrl: string;
   private currentUrl: string;
   constructor(public api: ApiService, private router: Router) {
       this.currentUrl = this.router.url;
       router.events.subscribe(event => {
           if (event instanceof NavigationEnd) {
               this.previousUrl = this.currentUrl;
               this.currentUrl = event.url;
           }
       });
   }

    //** Check role wise permissions */
    checkRolePermission(module:any): void {
        this.api.get('permissions').subscribe((response: any) => {
            if (response.data) {
                response.data.forEach(p => {
                    //  if (p.module_name == module && p.method_name == method) {
                    if (p.module_name == module) {
                        this.permission.push(p.module_name + '_' + p.method_name);
                        //console.log(this.permission)
                    }
                });
            }
            else {
                console.log('Permission not found in checkRolePermission');
                this.permission = []
            }
        });
    }

    /******************************************************************** */
    checkRoutePermission(module) {
        let moduleName = module;
        let permissionSlug = [];
        this.api.get('permissions').subscribe((response: any) => {
            if (response.data) {
                response.data.forEach(p => {
                    //  if (p.module_name == module && p.method_name == method) {
                    if (p.module_name == module) {
                        permissionSlug.push(p.permission_slug);
                        //console.log(this.permission)
                    }
                });
                this.routePermission = {
                    module: moduleName,
                    permission_slug: permissionSlug
                }
            }
            else {
                console.log('Permission not found in checkRolePermission');
                this.routePermission.permission_slug = []
            }
        });
    }
    /******************************************************************** */

    /******************** Get Previos URL ********************* */
    public getPreviousUrl() {
        return this.previousUrl;
    }
}




