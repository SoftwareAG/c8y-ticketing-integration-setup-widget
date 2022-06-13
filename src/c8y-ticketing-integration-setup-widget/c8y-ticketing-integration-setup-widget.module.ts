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

import { CoreModule, HOOK_COMPONENTS } from "@c8y/ngx-components";
import { CumulocityTicketingIntegrationSetupWidgetConfig } from "./c8y-ticketing-integration-setup-widget.config.component";
import { CumulocityTicketingIntegrationSetupWidget } from "./c8y-ticketing-integration-setup-widget.component";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { ChartsModule } from "ng2-charts";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { TicketCommentModal } from "./modal/ticket-comment-modal.component";
import { ModalModule } from "ngx-bootstrap/modal";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";

@NgModule({
    imports: [CoreModule, HttpClientModule, ChartsModule, PaginationModule, ModalModule, BsDatepickerModule],
    declarations: [CumulocityTicketingIntegrationSetupWidget, CumulocityTicketingIntegrationSetupWidgetConfig, TicketCommentModal],
    entryComponents: [CumulocityTicketingIntegrationSetupWidget, CumulocityTicketingIntegrationSetupWidgetConfig, TicketCommentModal],
    providers: [
        {
            provide: HOOK_COMPONENTS,
            multi: true,
            useValue: {
                id: "global.presales.c8y.ticketing.integration.setup.widget",
                label: "Ticketing Integration Setup",
                description: "To configure Cumulocity IoT Ticketing Integration microservice and view tickets.",
                component: CumulocityTicketingIntegrationSetupWidget,
                configComponent: CumulocityTicketingIntegrationSetupWidgetConfig,
                previewImage: require("@widget-assets/img-preview.png"),
                data: {
                    ng1: {
                        options: { noDeviceTarget: true, deviceTargetNotRequired: true },
                    },
                },
            },
        }
    ],
})
export class CumulocityTicketingIntegrationSetupWidgetModule { }
