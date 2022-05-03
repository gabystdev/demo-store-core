import { Navigation } from '#components/Navigation'
import { getProductWithVariants, LocalizedProduct, LocalizedProductWithVariant, products } from '#data/products'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { withLocalePaths } from '#i18n/withLocalePaths'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import { VariantSelector as DemoStoreVariantSelector } from '#components/VariantSelector'
import { AddToCartButton, AvailabilityContainer, AvailabilityTemplate, ItemContainer, OrderContainer, OrderStorage, Price, PricesContainer } from '@commercelayer/react-components'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { getLocale } from '#i18n/locale'
import { Container } from '#components/Container'
import { Header } from '#components/Header'
import { Page } from '#components/Page'

type Query = {
  locale: string
  slug: string[]
}

type Props = {
  product: LocalizedProductWithVariant
}

const ProductDetailPage: NextPage<Props> = ({ product }) => {
  const [currentProduct, setCurrentProduct] = useState<LocalizedProduct>()
  const router = useRouter()

  const locale = getLocale(router.query.locale as string)

  return (
    <Page title={product.name}>
      <Head>
        <link rel="canonical" href={`${router.basePath}/${router.query.locale}/product/${product.variants[0].slug}`} />
      </Head>

      <Container>
        <Header />

        <Navigation />

        <p>{product.code}</p>
        <img width="300" src={product.images[0]} alt={product.name} />
        <p>{product.name}</p>
        <p>{product.description}</p>
        <pre>{JSON.stringify(product.variant, undefined, 4)}</pre>

        <DemoStoreVariantSelector product={product} onChange={setCurrentProduct} />

        <OrderStorage persistKey={`country-${locale?.country?.code}`} clearWhenPlaced>
          <OrderContainer attributes={{
            language_code: locale?.language.code
          }}>
            <ItemContainer>
              <PricesContainer skuCode={currentProduct?.code}><Price /></PricesContainer>

              { /** @ts-expect-error */ }
              <AddToCartButton skuCode={currentProduct?.code} buyNowMode={false} checkoutUrl='https://mm-demo-store-1.checkout-test.commercelayer.app/'>
                {
                  (props) => (
                    <button onClick={props.handleClick} disabled={props.disabled} className={`block h-10 px-6 font-semibold rounded-md ${props.disabled ? 'bg-gray-300' : 'bg-black'} text-white`}>Add to cart</button>
                  )
                }
              </AddToCartButton>

              <AvailabilityContainer skuCode={currentProduct?.code}>
                <AvailabilityTemplate />
              </AvailabilityContainer>
            </ItemContainer>
          </OrderContainer>
        </OrderStorage>
      </Container>

    </Page>
  )
}

export const getStaticPaths: GetStaticPaths<Query> = () => {
  return withLocalePaths({
    paths: products.map(product => ({
      params: {
        slug: product.slug.split('/')
      }
    })),
    fallback: false
  })
}

export const getStaticProps: GetStaticProps<Props, Query> = async ({ params }) => {
  const { slug, locale } = params!

  return {
    props: {
      product: getProductWithVariants(slug.pop()!, locale),
      ...(await serverSideTranslations(locale))
    }
  }
}

export default ProductDetailPage