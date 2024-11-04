import { MutationcheckoutDiscountCodeRemoveArgs, } from './types/2024-04'
import { MutationcartDiscountCodesUpdateArgs  } from './types/2024-10'

type RemoveDiscountInputMapper = {
  cartId: MutationcartDiscountCodesUpdateArgs['cartId'],
  discountCodes: MutationcartDiscountCodesUpdateArgs['discountCodes']
}

export const removeDiscountInputMapper = (
  checkoutId: MutationcheckoutDiscountCodeRemoveArgs['checkoutId'],
): RemoveDiscountInputMapper => {
   return { 
    cartId: checkoutId,
    discountCodes: []
  }
}