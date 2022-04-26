import { getLocale } from '#i18n/locale'
import { AuthReturnType, ClientCredentials, getSalesChannelToken } from '@commercelayer/js-auth'
import { CommerceLayer } from '@commercelayer/react-components'
import { useRouter } from 'next/router'
import { FC, useEffect, useMemo, useState } from 'react'

type Auth = {
  accessToken: string
  refreshToken?: string
  expires?: number
  tokenType: string
}

const getClientCredentials = (market: number): ClientCredentials => ({
  clientId: process.env.NEXT_PUBLIC_CL_CLIENT_ID,
  endpoint: process.env.NEXT_PUBLIC_CL_ENDPOINT,
  scope: `market:${market}`
})

const getAuth = (market: number): Auth | null => {
  const storeKey = getStoreKey(market)
  return JSON.parse(localStorage.getItem(storeKey) || 'null')
}

const storeAuth = (market: number, authReturn: Awaited<AuthReturnType>): Auth | null => {
  if (!authReturn) {
    return null
  }

  const storeKey = getStoreKey(market)

  const auth: Auth = {
    tokenType: authReturn.tokenType,
    accessToken: authReturn.accessToken,
    expires: authReturn.expires?.getTime(),
    refreshToken: authReturn.refreshToken
  }

  localStorage.setItem(storeKey, JSON.stringify(auth))

  return auth
}

const getStoreKey = <M extends number>(market: M): `clayer_token-market:${M}` => `clayer_token-market:${market}`

const hasExpired = (time: number | undefined): boolean => time === undefined || time < Date.now()

const isValid = (auth: Auth | null): auth is Auth => !hasExpired(auth?.expires)

export const Auth: FC = ({ children }) => {

  const router = useRouter()

  const locale = useMemo(() => getLocale(router.query.locale as string), [router])

  const [market, setMarket] = useState<number | undefined>(locale?.country?.market)
  const [auth, setAuth] = useState<Auth | null>(null)

  useEffect(function updateMarket() {
    if (locale?.country?.market !== market) {
      setMarket(locale?.country?.market)
    }
  }, [locale, market])

  useEffect(function updateAccessToken() {
    if (market === undefined) {
      setAuth(null)
      return
    }

    const storedAuth: Auth | null = getAuth(market)
    const authIsValid = isValid(storedAuth)

    if (authIsValid) {
      setAuth(storedAuth)
    } else {
      getSalesChannelToken( getClientCredentials(market) )
        .then( authReturn => setAuth( storeAuth(market, authReturn) ) )
    }
  }, [market])

  if (!auth) {
    return <>{children}</>
  }

  return (
    <CommerceLayer accessToken={auth.accessToken} endpoint={process.env.NEXT_PUBLIC_CL_ENDPOINT}>
      <>{children}</>
    </CommerceLayer>
  )
}