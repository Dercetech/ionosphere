import { Environment } from "./environment.d";

export const ENV: Environment = {
  production: false,
  mode: "Dev",
  isDebugMode: true,
  firebase: {
    apiKey: "AIzaSyArMdEnPRo8IgJg1mfegoL4efAcx8p-t5Q",
    authDomain: "flycare-ico-dev.firebaseapp.com",
    databaseURL: "https://flycare-ico-dev.firebaseio.com",
    projectId: "flycare-ico-dev",
    storageBucket: "flycare-ico-dev.appspot.com",
    messagingSenderId: "643888185880"
  }
};
