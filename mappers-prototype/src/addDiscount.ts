import { MutationcheckoutDiscountCodeApplyV2Args } from './types/2024-04'
import { MutationcartDiscountCodesUpdateArgs } from './types/2025-01'

type AddDiscountInputMapper = {
  cartId: MutationcartDiscountCodesUpdateArgs['cartId'],
  discountCodes: MutationcartDiscountCodesUpdateArgs['discountCodes']
}

export const addDiscountInputMapper = (
  checkoutId: MutationcheckoutDiscountCodeApplyV2Args['checkoutId'],
  discountCode: MutationcheckoutDiscountCodeApplyV2Args['discountCode']
): AddDiscountInputMapper => {
  return {
    cartId: checkoutId,
    // NOTE: checkout support only one discount code
    discountCodes: discountCode ? [discountCode] : []
  }
}
