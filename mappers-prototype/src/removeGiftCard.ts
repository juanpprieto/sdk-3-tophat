import { MutationcheckoutGiftCardRemoveV2Args } from './types/2024-04'
import { MutationcartGiftCardCodesUpdateArgs, AppliedGiftCard  } from './types/2024-10'

type AddDiscountInputMapper = {
  cartId: MutationcartGiftCardCodesUpdateArgs['cartId'],
  giftCardCodes: MutationcartGiftCardCodesUpdateArgs['giftCardCodes']
}

export const removeGiftCardInputMapper = (
  checkoutId: MutationcheckoutGiftCardRemoveV2Args['checkoutId'],
  appliedGiftCardId: MutationcheckoutGiftCardRemoveV2Args['appliedGiftCardId'],
  appliedGiftCards: Array<AppliedGiftCard>
): AddDiscountInputMapper => {
   return { 
    cartId: checkoutId,
    giftCardCodes: appliedGiftCards
     .filter((appliedGiftCard) => appliedGiftCard.id !== appliedGiftCardId)
     // TODO: Figure out how to map appliedGiftCardIds to giftCardCodes
     .map((appliedGiftCard) => appliedGiftCard.lastCharacters)
  }
}
