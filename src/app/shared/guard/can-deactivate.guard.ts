import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

export interface DeactivateGuardComponent {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
    providedIn: 'root',
})

export class CanDeactivateGuard implements
    CanDeactivate<DeactivateGuardComponent> {

    canDeactivate(component: DeactivateGuardComponent) {
        return component.canDeactivate && component.canDeactivate();
    }
}