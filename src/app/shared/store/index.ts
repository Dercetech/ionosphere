import * as fromMenu from './menu';

export const rootStores = {
    menu: fromMenu.MenuStore
};

export const rootStoresToProvide = [
    fromMenu.MenuStore
];