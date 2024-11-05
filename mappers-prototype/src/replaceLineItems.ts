import { MutationcheckoutLineItemsReplaceArgs } from './types/2024-04'
import { CartLineUpdateInput } from './types/2024-10'

type ReplaceLineItemsInputMapper = {
  cartId: string,
  lines: Array<Omit<CartLineUpdateInput, 'id'>>
}

export const replaceLineItemsInputMapper = (
  checkoutId: MutationcheckoutLineItemsReplaceArgs['checkoutId'],
  lineItems: MutationcheckoutLineItemsReplaceArgs['lineItems']
): ReplaceLineItemsInputMapper => {
  return {
    cartId: checkoutId,
    lines: lineItems.map((lineItem) => {
      let line = {} as CartLineUpdateInput

      if (lineItem.quantity) {
        line.quantity = lineItem.quantity
      }

      if (lineItem.variantId) {
        line.merchandiseId = lineItem.variantId
      }

      if (lineItem.customAttributes) {
        line.attributes = lineItem.customAttributes
      }

      return line
    })
  }
}
