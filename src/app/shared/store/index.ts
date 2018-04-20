import * as fromAuthentication from './authentication';
import * as fromMenu from './menu';
import * as fromInterface from './interface';

export const rootStores = {
  authentication: fromAuthentication.AuthenticationStore,
  menu: fromMenu.MenuStore,
  interface: fromInterface.InterfaceStore
};

export const rootStoresToProvide = Object.keys(rootStores).reduce(
  (accumulator, current) => {
    accumulator.push(current);
    return accumulator;
  },
  []
);

/*
export const rootStoresToProvide = [
  fromAuthentication.AuthenticationStore,
  fromMenu.MenuStore,
  fromInterface.InterfaceStore
];
*/
