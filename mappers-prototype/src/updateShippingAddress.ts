import { MutationcheckoutLineItemsUpdateArgs, MailingAddressInput as CheckoutMailingAddressInput } from './types/2024-04'
import { MailingAddressInput } from './types/2024-10'

type UpdateShippingAddressInputMapper = {
  cartId: string,
  buyerIdentity: {
    deliveryAddressPreferences: Array<{ deliveryAddress: MailingAddressInput }>
  }
}

export const updateShippingAddressInputMapper = (
  checkoutId: MutationcheckoutLineItemsUpdateArgs['checkoutId'],
  shippingAddress: CheckoutMailingAddressInput,
): UpdateShippingAddressInputMapper => {
  let deliveryAddress: MailingAddressInput = {}

  if (shippingAddress.address1) {
    deliveryAddress.address1 = shippingAddress.address1
  }

  if (shippingAddress.address2) {
    deliveryAddress.address2 = shippingAddress.address2
  }

  if (shippingAddress.city) {
    deliveryAddress.city = shippingAddress.city
  }

  if (shippingAddress.company) {
    deliveryAddress.company = shippingAddress.company
  }

  if (shippingAddress.country) {
    deliveryAddress.country = shippingAddress.country
  }

  if (shippingAddress.firstName) {
    deliveryAddress.firstName = shippingAddress.firstName
  }

  if (shippingAddress.lastName) {
    deliveryAddress.lastName = shippingAddress.lastName
  }

  if (shippingAddress.phone) {
    deliveryAddress.phone = shippingAddress.phone
  }

  if (shippingAddress.zip) {
    deliveryAddress.zip = shippingAddress.zip
  }

  if (shippingAddress.province) {
    deliveryAddress.province = shippingAddress.province
  }

  const withDeliveryAddress = deliveryAddress && Object.keys(deliveryAddress).length > 0
  return {
    cartId: checkoutId,
    buyerIdentity: {
      deliveryAddressPreferences: withDeliveryAddress ? [{ deliveryAddress }] : []
    }
  }
}
