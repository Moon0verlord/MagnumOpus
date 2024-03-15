import { NuxtAuthHandler } from '#auth'
import OktaProvider from "next-auth/providers/okta";

export default NuxtAuthHandler({
    providers: [
        // as any here to resolve a false type checking issue. this is generally not a good fix but eh
        (OktaProvider as any).default({
            clientId: process.env.OKTA_CLIENT_ID,
            clientSecret: process.env.OKTA_CLIENT_SECRET,
            issuer: process.env.OKTA_DOMAIN,
            pkce: true,
        })
    ]
})