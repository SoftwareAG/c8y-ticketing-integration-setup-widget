# Ticketing Integration Setup Widget for Cumulocity IoT

This widget is dependent on Cumulocity IoT Ticketing Integration microservice. It allows to configure the microservice and see the tickets list and charts from ticketing platform.

![Preview](src/c8y-ticketing-integration-setup-widget/assets/img-preview.png)

### Installation - for the dashboards using Runtime Widget Loader
1. Download the latest `c8y-ticketing-integration-setup-widget-{version}.zip` file from the Releases section.
2. Make sure you have Application Builder app installed.
3. Open a dashboard.
4. Click `more...`.
5. Select `Install Widget` and follow the instructions.

### Configuration - to add the widget on dashboard
1. Make sure you have successfully installed the widget.
2. Click on `Add widget`.
3. Choose `Ticket Integration Setup` widget.
4. `Title` is the title of widget. Provide a relevant name. You may choose to hide this. Go to `Appearance` tab and choose `Hidden` under `Widget header style`.
5. `Platform` is ticketing platform. At the moment only webMethods AgileApps is supported.
6. `Tenant url` is base url of ticketing platform. It must not end on '/'.
7. `Username` is username of ticketing platform.
8. `Password` is password of ticketing platform.
9. `Account id` is customer account record id to which all the tickets created will be assigned to.
10. `Create tickets automatically on device alarm mapping matched` controls whether tickets should be created automatically on alarm creation or not.
11. `Change alarm status to ACKNOWLEDGE automcatically after creating ticket` controls whether to change alarm status to 'Acknowledge' after ticket creation or not.
12. Click `Save configuration` to save ticketing platform configuration.
13. Add or remove `Device Alarm Mappings` and click Save Mappings buttons. Mappings means for which device id and alarm type ticket needs to be created.
14. `Maximum total tickets` is how many total tickets need to be fetched from the ticketing platform.
15. `Tickets page size` is how many tickets need to be shown in the table at once.
16. Add and remove `Chart colors` for tickets by priority, tickets by status and tickets by device charts. 
17. Click `Save` to add the widget on the dashboard.
18. In case you see unexpected results on the widget, refer to browser console to see if there are error logs.

### Development - to do the enhancements and testing locally
1. Clone the repository on local machine using `git clone https://github.com/SoftwareAG/c8y-ticketing-integration-setup-widget.git`.
2. Run `npm install` to download the module dependencies.
3. Install c8ycli `npm install -g @c8y/cli` if not already.
4. Run `c8ycli server -u https://your_tenant_url` to start the server.
5. Go to `http://localhost:9000/apps/cockpit/` in the browser to view and test your changes.
6. (Optional) push the changes back to this repository.

### Build - to create a new build for the Runtime Widget Loader
1. Finish the development and testing on your local machine.
2. Run `gulp` to start the build process. Run `npm install -g gulp` to install gulp if not already.
3. Use `c8y-ticketing-integration-setup-widget-{version}.zip` file in the `dist` folder as a distribution.

------------------------------

These tools are provided as-is and without warranty or support. They do not constitute part of the Software AG product suite. Users are free to use, fork and modify them, subject to the license agreement. While Software AG welcomes contributions, we cannot guarantee to include every contribution in the master project.

------------------------------

For more information you can Ask a Question in the [TECHcommunity Forums](http://tech.forums.softwareag.com/techjforum/forums/list.page?product=cumulocity).
  
  
You can find additional information in the [Software AG TECHcommunity](http://techcommunity.softwareag.com/home/-/product/name/cumulocity).