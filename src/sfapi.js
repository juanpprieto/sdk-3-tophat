import {createStorefrontApiClient} from '@shopify/storefront-api-client';
import { fetch } from 'fetch-undici';

const client = createStorefrontApiClient({
  storeDomain: 'https://juanprieto.myshopify.com',
  apiVersion: '2024-10',
  publicAccessToken: 'c23ad8269962738dd66dfd85d9b45a2d',
  customFetchApi: fetch,
});

const CART_LINE_FRAGMENT = `#graphql
fragment CartLineFragment on CartLine {
  id
  merchandise {
    ... on ProductVariant {
      id
      title
      image {
        id
        src: url
        altText
        width
        height
      }
      product {
        id
        handle
        title
      }
      weight
      available: availableForSale
      sku
      selectedOptions {
        name
        value
      }
      unitPriceMeasurement {
        measuredType
        quantityUnit
        quantityValue
        referenceUnit
        referenceValue
      }
    }
  }
  quantity
  attributes {
    key
    value
  }
  cost {
    totalAmount {
      amount
      currencyCode
    }
    subtotalAmount {
      amount
      currencyCode
    }
    amountPerQuantity {
      amount
      currencyCode
    }
    compareAtAmountPerQuantity {
      amount
      currencyCode
    }
  }
  discountAllocations {
    discountedAmount {
      amount
      currencyCode
    }
  }
  sellingPlanAllocation {
    checkoutChargeAmount {
      amount
      currencyCode
    }
    sellingPlan {
      id
    }
    priceAdjustments {
      compareAtPrice {
        amount
        currencyCode
      }
      perDeliveryPrice {
        amount
        currencyCode
      }
      price {
        amount
        currencyCode
      }
      unitPrice {
        amount
        currencyCode
      }
    }
  }
}
`

const CART_FRAGMENT = `#graphql
${CART_LINE_FRAGMENT}
fragment CartFragment on Cart {
  id
  createdAt
  updatedAt
  lines(first: 10) {
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    edges {
      node {
        ...CartLineFragment
      }
    }
  }
  attributes {
    key
    value
  }
  cost {
    totalAmount {
      amount
      currencyCode
    }
    subtotalAmount {
      amount
      currencyCode
    }
    totalTaxAmount {
      amount
      currencyCode
    }
    totalDutyAmount {
      amount
      currencyCode
    }
  }
  checkoutUrl
  discountCodes {
    applicable
    code
  }
  buyerIdentity {
    countryCode
    preferences {
      delivery {
        coordinates {
          latitude
          longitude
          countryCode
        }
        deliveryMethod
        pickupHandle
      }
      wallet
    }
    email
    phone
    customer {
      email
    }
    deliveryAddressPreferences {
      ... on MailingAddress {
        address1
        address2
        city
        company
        country
        countryCodeV2
        firstName
        formatted
        formattedArea
        lastName
        latitude
        longitude
        name
        phone
        province
        provinceCode
      }
    }
  }
  deliveryGroups(first: 10) {
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    edges {
      node {
        id
        deliveryAddress {
          address2
          address1
          city
          company
          country
          countryCodeV2
          firstName
          formatted
          formattedArea
          lastName
          latitude
          longitude
          name
          phone
          province
          provinceCode
        }
        deliveryOptions {
          code
          deliveryMethodType
          description
          estimatedCost {
            amount
            currencyCode
          }
          handle
          title
        }
        selectedDeliveryOption {
          code
          deliveryMethodType
          description
          estimatedCost {
            amount
            currencyCode
          }
          handle
          title
        }
        cartLines(first: 10) {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
  appliedGiftCards {
    id
    amountUsed {
      amount
      currencyCode
    }
    balance {
      amount
    }
    lastCharacters
    presentmentAmountUsed {
      amount
      currencyCode
    }
  }
  note
}
`

const CART_CREATE_MUTATION = `
${CART_FRAGMENT}
mutation ($input: CartInput!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    cartCreate(input: $input) {
      userErrors {
        message
        code
        field
      }
      cart {
        ...CartFragment
      }
    }
  }
`

export const sfapi = {
  shop: async () => {
    return await fetch('https://juanprieto.myshopify.com/api/unstable/graphql.json', {
      method: 'POST',
      body: JSON.stringify({
        query: `
          {
            shop {
              name
              description
              primaryDomain {
                host
              }
            }
          }
        `
      }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Shopify-Storefront-Access-Token': 'c23ad8269962738dd66dfd85d9b45a2d'
        }
    })
  },

  create: async (input) => {
    return await client.request(CART_CREATE_MUTATION, {
      variables: {
        input,
        country: 'US',
        language: 'EN'
      }
    })
  },
}

