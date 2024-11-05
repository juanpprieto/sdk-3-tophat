import { MutationcheckoutLineItemsUpdateArgs } from './types/2024-04'
import { CartLineUpdateInput  } from './types/2024-10'

type UpdateLineItemsInputMapper = {
  cartId: string,
  lines: Array<CartLineUpdateInput>
}

export const updateLineItemsInputMapper = (
  checkoutId: MutationcheckoutLineItemsUpdateArgs['checkoutId'],
  lineItems: MutationcheckoutLineItemsUpdateArgs['lineItems']
): UpdateLineItemsInputMapper => {
   return { 
    cartId: checkoutId,
    lines: lineItems.map((lineItem) => {
      if (!lineItem.id) {
        return null
      }

     let line = {id: lineItem.id} as CartLineUpdateInput

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
    }).filter(Boolean) as Array<CartLineUpdateInput>
  }
}
