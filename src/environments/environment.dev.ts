import { Environment } from './environment.d';

export const ENV: Environment = {
  production: false,
  mode: 'Dev',
  isDebugMode: true,
  firebase: {
    apiKey: 'AIzaSyAhmHrh9QPBx8pQuRaBTpFvNq68arEHDzc',
    authDomain: 'ionosphere-dev.firebaseapp.com',
    databaseURL: 'https://ionosphere-dev.firebaseio.com',
    projectId: 'ionosphere-dev',
    storageBucket: '',
    messagingSenderId: '188924942427'
  },
  interface: {
    allowMenu: true,
    allowHeader: true
  }
};
