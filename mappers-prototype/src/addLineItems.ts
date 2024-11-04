import { MutationcheckoutLineItemsAddArgs } from './types/2024-04'
import { CartLineUpdateInput  } from './types/2024-10'

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
      return {
        quantity: lineItem.quantity,
        merchandiseId: lineItem.variantId,
        attributes: lineItem.customAttributes
      }
    })
  }
}
