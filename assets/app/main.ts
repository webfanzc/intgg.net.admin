import './polyfills';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from "./app.module";
platformBrowserDynamic().bootstrapModule(AppModule);

//import { WebModule } from "./web.module";
//platformBrowserDynamic().bootstrapModule(WebModule);