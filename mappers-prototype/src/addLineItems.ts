import { MutationcheckoutLineItemsAddArgs } from './types/2024-04'
import { CartLineUpdateInput } from './types/2024-10'

type AddLineItemsInputMapper = {
  cartId: string,
  lines: Array<Omit<CartLineUpdateInput, 'id'>>
}

export const addLineItemsInputMapper = (
  checkoutId: MutationcheckoutLineItemsAddArgs['checkoutId'],
  lineItems: MutationcheckoutLineItemsAddArgs['lineItems']
): AddLineItemsInputMapper => {
  return {
    cartId: checkoutId,
    lines: lineItems.map((lineItem) => {
      let line = {} as CartLineUpdateInput

      if (lineItem.customAttributes) {
        line.attributes = lineItem.customAttributes
      }

      if (lineItem.quantity) {
        line.quantity = lineItem.quantity
      }

      if (lineItem.variantId) {
        line.merchandiseId = lineItem.variantId
      }

      return line
    })
  }
}
