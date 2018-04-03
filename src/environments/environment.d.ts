export interface Environment {
  production: boolean;
  mode: string;
  isDebugMode: boolean;
  firebase: any;
  interface: {
    showMenu: boolean;
    showHeader: boolean;
  }
}
