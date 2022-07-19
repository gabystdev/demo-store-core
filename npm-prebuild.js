// @ts-check

const { getSalesChannelToken } = require('@commercelayer/js-auth')
const CommerceLayer = require('@commercelayer/sdk').default
const { writeFileSync } = require('fs')
const { resolve } = require('path')


const organizationJsonPath = resolve(__dirname, 'data', 'json', 'organization.json')
writeFileSync(organizationJsonPath, '{}', { encoding: 'utf-8' })

const { NEXT_PUBLIC_CL_ENDPOINT, NEXT_PUBLIC_CL_CLIENT_ID } = process.env

if (!NEXT_PUBLIC_CL_CLIENT_ID) {
  throw new Error('NEXT_PUBLIC_CL_CLIENT_ID env variable must be defined!')
}

if (!NEXT_PUBLIC_CL_ENDPOINT) {
  throw new Error('NEXT_PUBLIC_CL_ENDPOINT env variable must be defined!')
}

const [, organization, domain] = NEXT_PUBLIC_CL_ENDPOINT.match(/^https?:\/\/(.*).(commercelayer.(co|io))$/) || []

getSalesChannelToken({
  clientId: NEXT_PUBLIC_CL_CLIENT_ID,
  endpoint: NEXT_PUBLIC_CL_ENDPOINT,
  scope: `market:all`
})
  .then(auth => {
    if (!auth){
      return
    }

    const client = CommerceLayer({
      accessToken: auth.accessToken,
      organization,
      domain
    })

    client.organization.retrieve()
      .then(organization => {
        
        const organizationSettings = {
          name: organization.name,
          favicon_url: organization.favicon_url,
          logo_url: organization.logo_url,
          primary_color: organization.primary_color
        }

        writeFileSync(
          organizationJsonPath,
          JSON.stringify(organizationSettings, undefined, 2),
          { encoding: 'utf-8' }
        )
      })

  })