// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '5pq27j66z2'
export const apiEndpoint = `https://${apiId}.execute-api.sa-east-1.amazonaws.com/dev`


export const authConfig = {
  // DONE: Create an Auth0 application and copy values from it into this map
  domain: 'dev-a2n6kf8z.us.auth0.com',            // Auth0 domain
  clientId: 'XVSZJXmElCat8p8gbkuOaMGJhbrVqRFY',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
