import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule as NgRouterModule } from "@angular/router";
import { UpgradeModule as NgUpgradeModule } from "@angular/upgrade/static";
import { CoreModule, HOOK_COMPONENTS, RouterModule } from "@c8y/ngx-components";
import { DashboardUpgradeModule, UpgradeModule, HybridAppModule, UPGRADE_ROUTES, ng1Modules } from "@c8y/ngx-components/upgrade";
import { AssetsNavigatorModule } from "@c8y/ngx-components/assets-navigator";
import { CockpitDashboardModule } from "@c8y/ngx-components/context-dashboard";
import { ReportsModule } from "@c8y/ngx-components/reports";
import { SensorPhoneModule } from "@c8y/ngx-components/sensor-phone";
import { CumulocityTicketingIntegrationSetupWidget } from './src/c8y-ticketing-integration-setup-widget/c8y-ticketing-integration-setup-widget.component';
import { CumulocityTicketingIntegrationSetupWidgetConfig } from './src/c8y-ticketing-integration-setup-widget/c8y-ticketing-integration-setup-widget.config.component';
import { ChartsModule } from "ng2-charts";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { TicketCommentModal } from "./src/c8y-ticketing-integration-setup-widget/modal/ticket-comment-modal.component";
import { ModalModule } from "ngx-bootstrap/modal";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { DecodeHtmlPipe } from "./src/c8y-ticketing-integration-setup-widget/pipe/DecodeHtmlPipe";
import { TicketIdReplacementPipe } from "./src/c8y-ticketing-integration-setup-widget/pipe/TicketIdReplacementPipe";

@NgModule({
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(),
    NgRouterModule.forRoot([...UPGRADE_ROUTES], { enableTracing: false, useHash: true }),
    CoreModule.forRoot(),
    AssetsNavigatorModule,
    ReportsModule,
    NgUpgradeModule,
    DashboardUpgradeModule,
    CockpitDashboardModule,
    SensorPhoneModule,
    UpgradeModule,
    ChartsModule,
    PaginationModule,
    ModalModule,
    BsDatepickerModule
  ],
  declarations: [
    CumulocityTicketingIntegrationSetupWidget, 
    CumulocityTicketingIntegrationSetupWidgetConfig, 
    TicketCommentModal, 
    DecodeHtmlPipe,
    TicketIdReplacementPipe
  ],
  entryComponents: [
    CumulocityTicketingIntegrationSetupWidget, 
    CumulocityTicketingIntegrationSetupWidgetConfig, 
    TicketCommentModal
  ],
  providers: [{
    provide: HOOK_COMPONENTS,
    multi: true,
    useValue: [
      {
        id: 'global.presales.c8y.ticketing.integration.setup.widget',
        label: 'Ticketing Integration Setup',
        description: 'To configure Cumulocity IoT Ticketing Integration microservice and view tickets.',
        component: CumulocityTicketingIntegrationSetupWidget,
        configComponent: CumulocityTicketingIntegrationSetupWidgetConfig,
        previewImage: require("@widget-assets/img-preview.png"),
        data: {
            ng1: {
                options: { 
                  noDeviceTarget: true, 
                  deviceTargetNotRequired: true 
                }
            }
        }
      }
    ]
  }]
})
export class AppModule extends HybridAppModule {
  constructor(protected upgrade: NgUpgradeModule) {
    super();
  }
}
