import { MutationcheckoutGiftCardRemoveV2Args } from './types/2024-04'
import { MutationcartGiftCardCodesUpdateArgs, AppliedGiftCard  } from './types/2025-01'

type AddDiscountInputMapper = {
  cartId: MutationcartGiftCardCodesUpdateArgs['cartId'],
  // TODO: Get MutatationcartGiftCardRemoveV2Args['appliedGiftCardId'] type
  appliedGiftCardIds: Array<AppliedGiftCard['id']>
}

export const removeGiftCardInputMapper = (
  checkoutId: MutationcheckoutGiftCardRemoveV2Args['checkoutId'],
  appliedGiftCardId: MutationcheckoutGiftCardRemoveV2Args['appliedGiftCardId'],
): AddDiscountInputMapper => {
   return { 
    cartId: checkoutId,
    appliedGiftCardIds: appliedGiftCardId ? [appliedGiftCardId] : [],
  }
}
