import { flattenReferencesFromCatalog, getCatalog } from '#data/catalogs'
import { rawDataProducts } from '#data/products'
import { getLocale } from '#i18n/locale'
import { serverSideTranslations } from '#i18n/serverSideTranslations'
import { withLocalePaths } from '#i18n/withLocalePaths'
import { getRootNavigationLinks } from '#utils/catalog'
import { flattenProductVariants, getProductWithVariants } from '#utils/products'
import generalConfig from 'config/general.config'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { ProductPageComponent, Props } from './ProductPageComponent'

type Query = {
  locale: string
  slug: string[]
}

export const getStaticPaths: GetStaticPaths<Query> = () => {
  return withLocalePaths(async localeCode => {
    const locale = getLocale(localeCode)
    const catalog = await getCatalog(locale)

    const references = flattenReferencesFromCatalog(catalog)
    const products = references.map(ref => getProductWithVariants(ref, locale.code, rawDataProducts))
    const flattenProducts = flattenProductVariants(products)

    return {
      fallback: false,
      paths: flattenProducts.map(product => ({
        params: {
          slug: product.slug.split('/')
        }
      }))
    }
  })
}

export const getStaticProps: GetStaticProps<Props, Query> = async ({ params }) => {
  const { locale: localeCode, slug } = params!
  const locale = getLocale(localeCode)
  const catalog = getCatalog(locale)

  const productSlug = slug.join('/')
  const productCode = productSlug.match(generalConfig.productSlugRegExp)?.groups?.productCode

  if (!productCode) {
    throw new Error(`"productSlugRegExp" is not properly configured. Cannot apply RegExp "${generalConfig.productSlugRegExp}" to the given product slug "${productSlug}"`)
  }

  return {
    props: {
      navigation: getRootNavigationLinks(catalog),
      product: getProductWithVariants(productCode, locale.code, rawDataProducts),
      ...(await serverSideTranslations(localeCode))
    }
  }
}

export default ProductPageComponent
