import { NgxConfigureOptions } from 'ngx-configure';

export class AppOptions extends NgxConfigureOptions {

    override ConfigurationURL = "assets/config.json";
    override AppVersion = "1.0.0";
    override BustCache = false;

}
