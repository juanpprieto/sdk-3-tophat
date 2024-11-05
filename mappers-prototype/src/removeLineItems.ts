import { MutationcheckoutLineItemsRemoveArgs } from './types/2024-04'
import { CartLineUpdateInput  } from './types/2024-10'

type RemoveLineItemsInputMapper = {
  cartId: string,
  lineIds: Array<CartLineUpdateInput['merchandiseId']>
}

export const removeLineItemsInputMapper = (
  checkoutId: MutationcheckoutLineItemsRemoveArgs['checkoutId'],
  lineItemIds: MutationcheckoutLineItemsRemoveArgs['lineItemIds']
): RemoveLineItemsInputMapper => {
   return { 
    cartId: checkoutId,
    lineIds: lineItemIds ?? []
  }
}
