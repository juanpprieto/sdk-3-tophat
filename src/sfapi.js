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
    ... on CartCodeDiscountAllocation {
      targetType
      code
      discountedAmount {
        amount
        currencyCode
      }
      __typename
    }
    ... on CartAutomaticDiscountAllocation {
      targetType
      title
      discountedAmount {
        amount
        currencyCode
      }
      __typename
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
  discountAllocations {
    ... on CartCodeDiscountAllocation {
      targetType
      code
      discountedAmount {
        amount
        currencyCode
      }
      __typename
    }
    ... on CartAutomaticDiscountAllocation {
      targetType
      title
      discountedAmount {
        amount
        currencyCode
      }
      __typename
    }
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

const CART_UPDATE_SHIPPING_ADDRESS_MUTATION = `#graphql
${CART_FRAGMENT}
  mutation cartDeliveryAddressUpdate($cartId: ID!, $address: MailingAddressInput!) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: {deliveryAddressPreferences: [ { deliveryAddress: $address } ]}) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`

const CART_CREATE_MUTATION = `#graphql
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

const CART_UPDATE_DISCOUNT_CODE_MUTATION = `#graphql
${CART_FRAGMENT}
mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]!) {
  cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
    cart {
      ...CartFragment
    }
    userErrors {
      field
      message
    }
  }
}
`

const CART_ADD_LINE_ITEMS_MUTATION = `#graphql
${CART_FRAGMENT}
mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
      ...CartFragment
    }
    userErrors {
      field
      message
      code
    }
  }
}
`

export const sfapi = {
  create: async (input) => {
    return await client.request(CART_CREATE_MUTATION, {
      variables: {
        input,
        country: 'US',
        language: 'EN'
      }
    })
  },

  updateDiscountCodes: async (cartId, discountCodes) => {
    return await client.request(CART_UPDATE_DISCOUNT_CODE_MUTATION, {
      variables: {
        cartId,
        discountCodes
      }
    })
  },

  addLineItems: async (cartId, lines) => {
    return await client.request(CART_ADD_LINE_ITEMS_MUTATION, {
      variables: {
        cartId,
        lines
      }
    })
  },

  updateShippingAddress: async (cartId, address) => {
    return await client.request(CART_UPDATE_SHIPPING_ADDRESS_MUTATION, {
      variables: {
        cartId,
        address
      }
    })
  }
}

