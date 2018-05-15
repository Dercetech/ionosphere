export interface Environment {
  production: boolean;
  mode: string;
  isDebugMode: boolean;
  firebase: any;
  interface: {
    allowMenu: boolean;
    allowHeader: boolean;
  };
}
