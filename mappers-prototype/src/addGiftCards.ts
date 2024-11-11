import { MutationcheckoutGiftCardsAppendArgs } from './types/2024-04'
import { MutationcartGiftCardCodesUpdateArgs  } from './types/2025-01'

type AddDiscountInputMapper = {
  cartId: MutationcartGiftCardCodesUpdateArgs['cartId'],
  giftCardCodes: MutationcartGiftCardCodesUpdateArgs['giftCardCodes']
}

export const addGiftCardsInputMapper = (
  checkoutId: MutationcheckoutGiftCardsAppendArgs['checkoutId'],
  giftCardCodes: MutationcheckoutGiftCardsAppendArgs['giftCardCodes']
): AddDiscountInputMapper => {
   return { 
    cartId: checkoutId,
    giftCardCodes: giftCardCodes 
  }
}
