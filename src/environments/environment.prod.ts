export const environment = {
  production: true,
  apiUrl: 'http://sgq.hugol.org.br:8080',
  tokenWhitelistedDomains: [ new RegExp('sgq.hugol.org.br:8080') ],
  tokenBlacklistedRoutes: [ new RegExp('\/oauth\/token') ]
};
