/**
 * /*
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
 *
 * @format
 */

import { Component, Input, OnInit } from '@angular/core';
import { IFetchOptions, IFetchResponse } from '@c8y/client';
import { AlertService } from '@c8y/ngx-components';
import { FetchClient } from '@c8y/ngx-components/api';
import * as _ from 'lodash';
import { DAMapping } from './da-mapping';
import { TPConfig } from './tp-config';


@Component({
    selector: "lib-c8y-ticketing-integration-setup-widget",
    templateUrl: "./c8y-ticketing-integration-setup-widget.component.html",
    styleUrls: ["./c8y-ticketing-integration-setup-widget.component.css"],
})
export class CumulocityTicketingIntegrationSetupWidget implements OnInit {

    @Input() config;

    public tpConfig: TPConfig = {
        name: '',
        tenantUrl: '',
        username: '',
        password: '',
        accountId: ''
    };

    public daMappings: DAMapping[] = [];

    constructor(private fetchClient: FetchClient, private alertService: AlertService) {
    }

    ngOnInit(): void {
        this.initialise();
    }

    private initialise(): void {
        try {
            this.initialiseTPConfig();
        } catch(err) {
            console.log("Ticketing Integration Setup Widget - initialise() "+err);
        }
    }

    private initialiseTPConfig(): void {
        let tpConfigFetchClient: Promise<IFetchResponse> = this.fetchClient.fetch("/service/ticketing/tpconfig");
            tpConfigFetchClient.then((resp: IFetchResponse) => {
                if(resp.status === 200) {
                    resp.json().then((jsonResp) => {
                        this.tpConfig = jsonResp;         
                        this.initialiseDAMappings();
                    }).catch((err)=> {
                        console.log("Ticketing Integration Setup Widget - Error accessing tpConfig response body as JSON: "+err);
                    });
                } else if(resp.status === 400) {
                    console.log("Ticketing Integration Setup Widget - tpConfig doesn't exist.");
                } else if(resp.status === 404) {
                    console.log("Ticketing Integration Setup Widget - Microservice or API is unavailable.");
                } else {
                    console.log("Ticketing Integration Setup Widget - Unable to fetch tpConfig: "+resp.status);
                }
            }).catch((err) => {
                console.log("Ticketing Integration Setup Widget - Error accessing tpConfig fetchClient: "+ err);
            });
    }

    private initialiseDAMappings(): void {
        let daMappingsFetchClient: Promise<IFetchResponse> = this.fetchClient.fetch("/service/ticketing/damappings");
        daMappingsFetchClient.then((resp: IFetchResponse) => {
            if(resp.status === 200) {
                resp.json().then((jsonResp) => {
                    this.daMappings = jsonResp;
                }).catch((err) => {
                    console.log("Ticketing Integration Setup Widget - Error accessing daMappings response body as JSON: "+err);
                });
            } else {
                console.log("Ticketing Integration Setup Widget - Unable to fetch daMappings: "+resp.status);
            }
        }).catch((err) => {
            console.log("Ticketing Integration Setup Widget - Error accessing dpMappings fetchClient: "+err);
        });
    }
    

    public isTPConfigValid(): boolean {
        return this.tpConfig.name !== undefined && this.tpConfig.name !== null && this.tpConfig.name !== ""
        && this.tpConfig.password !== undefined && this.tpConfig.password !== null && this.tpConfig.password !== ""
        && this.tpConfig.username !== undefined && this.tpConfig.username !== null && this.tpConfig.username !== ""
        && this.tpConfig.tenantUrl !== undefined && this.tpConfig.tenantUrl !== null && this.tpConfig.tenantUrl !== ""
        && this.tpConfig.accountId !== undefined && this.tpConfig.accountId !== null && this.tpConfig.accountId !== ""
    }

    public addDAMapping() {
        this.daMappings.push({
            deviceId: '',
            alarmType: ''
        });
    }

    public removeDAMapping(index: number) {
        this.daMappings.splice(index, 1);
    }
   
    public saveDAMappings() {
        const fetchOptions: IFetchOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.daMappings)
        };
        let daMappingsFetchClient: Promise<IFetchResponse> = this.fetchClient.fetch("/service/ticketing/damappings", fetchOptions);
        daMappingsFetchClient.then((resp: IFetchResponse) => {
            if(resp.status === 200) {
                this.alertService.success("Mappings saved successfully.");
            } else {
                this.alertService.danger("Error saving mappings.", resp.status.toString());
            }
        }).catch((err) => {
            this.alertService.danger("Error saving mappings.", err.toString());
        });
    }

}
