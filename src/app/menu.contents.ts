import { routes } from './routing/routes';

export interface menuEntry {}

export const menuContents = {
  scroll: [
    {
      id: 'header',
      type: 'flat-group',
      categories: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          fa: 'fas fa-home',
          destination: routes.dashboard.page
        },
        {
          id: 'admin',
          title: 'Admin',
          fa: 'fas fa-cog',
          destination: routes.adminUsers.page
        }
      ]
    },

    {
      id: 'section1',
      type: 'group',
      title: 'Trading bots',
      categories: [
        {
          id: 'entry0',
          title: 'Overview',
          fa: 'fa fa-line-chart'
        },
        {
          id: 'entry_algo',
          title: 'Algorithms',
          fa: 'fa fa-flask',
          sub: [
            {
              id: 'sub1',
              title: 'Generic',
              fa: 'fa fa-user-o'
            },
            {
              id: 'sub2',
              title: 'Columbus',
              fa: 'fa fa-user-o'
            },
            {
              id: 'sub3',
              title: 'Split',
              fa: 'fa fa-user-o'
            },
            {
              id: 'sub4',
              title: 'Blyat',
              fa: 'fa fa-user-o'
            }
          ]
        },
        {
          id: 'entry1',
          title: 'My bots',
          fa: 'fa fa-users'
        },
        {
          id: 'entry2',
          title: 'Active processing',
          fa: 'fa fa-cogs',
          sub: [
            {
              id: 'sub1',
              title: 'MyBot_1',
              fa: 'fa fa-user-o'
            },
            {
              id: 'entry1',
              title: 'Columbus tracker',
              fa: 'fa fa-user-o'
            },
            {
              id: 'entry1',
              title: 'Split opportunist',
              fa: 'fa fa-user-o'
            }
          ]
        }
      ]
    },

    {
      id: 'section2',
      type: 'group',
      title: 'My wallets',
      categories: [
        {
          id: 'entry1',
          title: 'Crypto',
          fa: 'fa fa-connectdevelop',
          sub: [
            {
              id: 'sub1',
              title: 'Bitcoin',
              fa: 'fa fa-btc'
            },
            {
              id: 'sub2',
              title: 'Ethereum',
              fa: 'fa fa-diamond'
            },
            {
              id: 'sub3',
              title: 'Litecoin',
              fa: 'fa fa-linode'
            }
          ]
        },

        {
          id: 'entry2',
          title: 'Fiat',
          fa: 'fa fa-bank',
          sub: [
            {
              id: 'sub1',
              title: 'Euro',
              fa: 'fa fa-euro'
            }
          ]
        }
      ]
    }
  ],

  footer: [
    {
      id: 'entry1',
      title: 'Free tier - upgrade',
      fa: 'fa fa-star-o'
    },
    {
      id: 'entry2',
      title: 'Settings',
      fa: 'fa fa-cog'
    },
    {
      id: 'logout',
      title: 'logout',
      fa: 'fas fa-sign-out-alt',
      action: 'logout'
    }
  ],

  drawer: true
};
