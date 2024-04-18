import { OktaAuth } from '@okta/okta-auth-js';

// CONFIG REPLACE EVERTYHING WITH APPS SETTINGS

const oktaAuth = new OktaAuth({
  issuer: 'https://dev-64980793.okta.com', // Replace with your Okta domain
  clientId: '0oagjb83l5tUB9Xxn5d7', // Replace with your Okta application's client ID
  redirectUri: 'http://localhost:5173/callback', // Replace with your Okta application's redirect URI
  responseType: ['code']
});


export default oktaAuth;