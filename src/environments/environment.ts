// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   production: false,
//   baseUrl: 'http://192.168.1.65/Centreel/index.php/',
//   client_id: 4,
//   client_secret: "iP5Pnj4W53ByRzLNi7qMBDecrHG8qVEMopbhI3to",
//   GOOGLE_API_BROWSER_KEY: "AIzaSyCGUPzlHtZaH_RWIWzsSvKE7gh1oU3rCOs",
// };

// export const environment = {
//   production: false,
//   baseUrl: 'http://192.168.1.63/centreel-backend/public/',
//   client_id: 4,
//   client_secret: "iP5Pnj4W53ByRzLNi7qMBDecrHG8qVEMopbhI3to",
//   GOOGLE_API_BROWSER_KEY: "AIzaSyCGUPzlHtZaH_RWIWzsSvKE7gh1oU3rCOs",
// };

export const environment = {
  production: false,
  // baseUrl: 'http://devapi.centreel.ca/',
  baseUrl: 'https://centreel-elb-1171899288.ca-central-1.elb.amazonaws.com/',
  client_id: 2,
  client_secret: "86uYm59gFcLwrnUcHZvQ3eXHwiCJiZDVaqA5t863",
  GOOGLE_API_BROWSER_KEY: "AIzaSyCGUPzlHtZaH_RWIWzsSvKE7gh1oU3rCOs",
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
