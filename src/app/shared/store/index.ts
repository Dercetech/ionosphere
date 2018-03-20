import * as fromMenu from './menu';
import * as fromInterface from './interface';

export const rootStores = {
    menu: fromMenu.MenuStore
};

export const rootStoresToProvide = [
    fromMenu.MenuStore
];