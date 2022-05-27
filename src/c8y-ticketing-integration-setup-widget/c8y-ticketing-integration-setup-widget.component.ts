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

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IFetchResponse } from '@c8y/client';
import { AlertService, ModalComponent } from '@c8y/ngx-components';
import { FetchClient } from '@c8y/ngx-components/api';
import { Chart } from 'chart.js';
import * as _ from 'lodash';
import { DAMapping } from './da-mapping';
import { MicroserviceHealth } from './microservice-health';
import { Ticket } from './ticket';
import { TPConfig } from './tp-config';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

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
        accountId: '',
        alarmSubscription: false
    };
    public daMappings: DAMapping[] = [];
    public paginatedDAMappings: DAMapping[] = [];
    public totalDAMappingsPerPage: number = 1;

    public tickets: Ticket[] = [];
    public paginatedTickets: Ticket[] = [];
    public totalTicketsPerPage: number = 1;

    private countByStatusLabels: string[] = [];
    private countByStatusDatapoints: number[] = []

    private countByPriorityLabels: string[] = [];
    private countByPriorityDatapoints: number[]= [];

    private chartColors = [];

    @ViewChild('#m1', {static: false}) modal: ModalComponent;


    public microserviceHealth: MicroserviceHealth = {
        status: "Checking..."
    };

    constructor(private fetchClient: FetchClient, private alertService: AlertService) {
    }

    ngOnInit(): void {
        this.initialise();
    }

    private initialise(): void {
        try {
            if(this.config.customwidgetdata !== undefined) {
                this.totalTicketsPerPage = this.config.customwidgetdata.ticketsPageSize;
                this.totalDAMappingsPerPage = this.config.customwidgetdata.daMappingsPageSize;
                this.chartColors = this.config.customwidgetdata.chartColors;
            }
            this.getMicroserviceHealth();
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
                        if(this.tpConfig.alarmSubscription) {
                            this.initialiseDAMappings();
                        }
                        this.getAllTickets();
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
                    this.paginatedDAMappings = jsonResp.slice(0, this.totalDAMappingsPerPage);
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
   
    
    private getAllTickets(): void {
        let ticketsFetchClient: Promise<IFetchResponse> = this.fetchClient.fetch("/service/ticketing/tickets");
        ticketsFetchClient.then((resp) => {
            if(resp.status === 200) {
                resp.json().then((tickets: Ticket[]) => {
                    
                    this.tickets = tickets;
                    this.paginatedTickets = tickets.slice(0, this.totalTicketsPerPage);

                    tickets.forEach((ticket) => {
                        let statusFoundIndex = this.findEntryInStatus(ticket.status);
                        if(statusFoundIndex === -1) {
                            this.countByStatusLabels.push(ticket.status);
                            this.countByStatusDatapoints.push(1);
                        } else {
                            this.countByStatusDatapoints[statusFoundIndex] = this.countByStatusDatapoints[statusFoundIndex] + 1;
                        }

                        let priorityFoundIndex = this.findEntryInPriority(ticket.priority);
                        if(priorityFoundIndex === -1) {
                            this.countByPriorityLabels.push(ticket.priority);
                            this.countByPriorityDatapoints.push(1);
                        } else {
                            this.countByPriorityDatapoints[priorityFoundIndex] = this.countByPriorityDatapoints[priorityFoundIndex] + 1;
                        }
                    });
                   
                    this.showPriorityChart();
                    this.showStatusChart();
                }).catch((err) => {
                    console.log("Error processing jsonResp");
                });
            }
        }).catch((err) => {
            console.log("Error fetching tickets");
        });
    }

    private findEntryInStatus(status: string): number {
        let foundIndex: number = -1;
        for(let i=0; i<this.countByStatusLabels.length; i++) {
            if(status === this.countByStatusLabels[i]) {
                foundIndex = i;
                break;
            }
        }
        return foundIndex;
    }

    private findEntryInPriority(priority: string): number {
        let foundIndex: number = -1;
        for(let i=0; i<this.countByPriorityLabels.length; i++) {
            if(priority === this.countByPriorityLabels[i]) {
                foundIndex = i;
                break;
            }
        }
        return foundIndex;
    }

    public getMicroserviceHealth(): void {
        let healthFetchClient: Promise<IFetchResponse> = this.fetchClient.fetch("/service/ticketing/health")
        healthFetchClient.then((resp: IFetchResponse) => {
            if(resp.status === 200) {
                resp.json().then((jsonResp) => {
                    this.microserviceHealth = jsonResp;
                });
            } else if(resp.status === 404) {
                this.microserviceHealth.status = "Unavailable";
            } else {
                console.log("Error checking microservice health..."+resp.status);
            }
        }).catch((err) => {
            console.log("Error checking microservice health..."+err);
        });
    }
    
    private showPriorityChart() {
        new Chart("priorityChart", {
            type: "pie",
            data: {
                labels: this.countByPriorityLabels,
                datasets: [{
                    data: this.countByPriorityDatapoints,
                    backgroundColor: this.chartColors
                }]
            },
            options: {
                legend: {
                    display: false
                }
            }
        });
    }

    private showStatusChart() {
        new Chart("statusChart", {
            type: "pie",
            data: {
                labels: this.countByStatusLabels,
                datasets: [{
                    data: this.countByStatusDatapoints,
                    backgroundColor: this.chartColors
                }]
            },
            options: {
                legend: {
                    display: false
                }
            }
        });
    }


    public ticketsPageChanged(event: PageChangedEvent): void {
        const startItem = (event.page - 1) * this.totalTicketsPerPage;
        const endItem = event.page * this.totalTicketsPerPage;
        this.paginatedTickets = this.tickets.slice(startItem, endItem);
    }

    public daMappingsPageChanged(event: PageChangedEvent): void {
        const startItem = (event.page - 1) * this.totalDAMappingsPerPage;
        const endItem = event.page * this.totalDAMappingsPerPage;
        this.paginatedDAMappings = this.daMappings.slice(startItem, endItem);
    }

}
