// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    userName: 'APPWEB',
    password: btoa('123456'),

    firebase: {
        apiKey: 'AIzaSyAYaVfUYjWC70PYaVEq8B6oJIzAEdRRk6Y',
        authDomain: 'aspirante-sena.firebaseapp.com',
        projectId: 'aspirante-sena',
        storageBucket: 'aspirante-sena.firebasestorage.app',
        messagingSenderId: '144463839739',
        appId: '1:144463839739:web:9213898234cc278bb60b5e',
    },
};
//  "indexes": "firestore.indexes.json"

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
