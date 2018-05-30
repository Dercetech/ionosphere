export interface Route {
  page: string;
}

export const routes: { [key: string]: Route } = {
  welcome: {
    page: 'WelcomePage'
  },
  login: {
    page: 'LoginPage'
  },
  dashboard: {
    page: 'DashboardPage'
  },
  adminUsers: {
    page: 'AdminUsersPage'
  }
};
