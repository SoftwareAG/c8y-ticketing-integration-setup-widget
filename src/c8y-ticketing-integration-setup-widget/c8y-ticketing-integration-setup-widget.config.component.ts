/*
* Copyright (c) 2019 Software AG, Darmstadt, Germany and/or its licensors
*
* SPDX-License-Identifier: Apache-2.0
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License. 
 */
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { IFetchOptions, IFetchResponse } from '@c8y/client';
import { AlertService } from '@c8y/ngx-components';
import { FetchClient } from '@c8y/ngx-components/api';
import * as _ from 'lodash';
import { TPConfig } from './tp-config';

@Component({
    selector: "c8y-ticketing-integration-setup-widget-config-component",
    templateUrl: "./c8y-ticketing-integration-setup-widget.config.component.html",
    styleUrls: ["./c8y-ticketing-integration-setup-widget.config.component.css"]
})
export class CumulocityTicketingIntegrationSetupWidgetConfig implements OnInit, OnDestroy {

    @Input() config: any = {};

    public tpConfig: TPConfig = {
        name: '',
        tenantUrl: '',
        username: '',
        password: '',
        accountId: ''
    };
    private tpConfigExists: boolean = false;

    constructor(private fetchClient: FetchClient, private alertService: AlertService) {}

    ngOnInit(): void {
        try {
            this.initialiseTPConfig();
        } catch(e) {
            this.alertService.danger("Ticketing Integration Setup Widget Config - ngOnInit()", e);
        }
    }

    private initialiseTPConfig(): void {
        let tpConfigFetchClient: Promise<IFetchResponse> = this.fetchClient.fetch("/service/ticketing/tpconfig");
        tpConfigFetchClient.then((resp: IFetchResponse) => {
            if(resp.status === 200) {
                resp.json().then((jsonResp) => {
                    this.tpConfig = jsonResp;
                    this.tpConfigExists = true;         
                }).catch((err)=> {
                    this.alertService.danger("Ticketing Integration Setup Widget Config - Error accessing tpConfig response body as JSON", err);
                });
            } else if(resp.status === 400) {
                this.alertService.danger("Ticketing Integration Setup Widget Config - tpConfig doesn't exist.");
            } else if(resp.status === 404) {
                this.alertService.danger("Ticketing Integration Setup Widget Config - Microservice or API is unavailable.");
            } else {
                this.alertService.danger("Ticketing Integration Setup Widget Config - Unable to fetch tpConfig.", resp.status.toString());
            }
        }).catch((err) => {
            this.alertService.danger("Ticketing Integration Setup Widget Config - Error accessing tpConfig fetchClient.", err);
        });
    }

    public saveTPConfig(): void {
        if(this.tpConfigExists) {
            this.updateTPConfig();
        } else {
            this.createTPConfig();
        }
    }

    private createTPConfig(): void {
        const fetchOptions: IFetchOptions = {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(this.tpConfig)
        };

        let tpConfigFetchClient: Promise<IFetchResponse> = this.fetchClient.fetch("/service/ticketing/tpconfig", fetchOptions);
        tpConfigFetchClient.then((resp: IFetchResponse) => {
            if(resp.status === 201) {
                this.tpConfigExists = true;
                this.alertService.success("Configuration saved successfully.");
            } else {
                this.alertService.danger("Error saving configuration.", resp.status.toString());
            }
        }).catch((err) => {
            this.alertService.danger("Error saving configuration.", err);
        });
    }

    private updateTPConfig(): void {
        const fetchOptions: IFetchOptions = {
           method: 'PUT',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(this.tpConfig)
        };

        let tpConfigFetchClient: Promise<IFetchResponse> = this.fetchClient.fetch("/service/ticketing/tpconfig", fetchOptions);
        tpConfigFetchClient.then((resp: IFetchResponse) => {
            if(resp.status === 200) {
                this.alertService.success("Configuration updated successfully.");
            } else {
                this.alertService.danger("Error updating configuration.", resp.status.toString());
            }
        }).catch((err) => {
            this.alertService.danger("Error updating configuration.", err);
        });
    }

    ngOnDestroy(): void {
        //unsubscribe from observables here
    }

}