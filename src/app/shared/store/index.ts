import * as fromMenu from './menu';
import * as fromInterface from './interface';

export const rootStores = {
    menu: fromMenu.MenuStore,
    interface: fromInterface.InterfaceStore
};

export const rootStoresToProvide = [
    fromMenu.MenuStore,
    fromInterface.InterfaceStore
];