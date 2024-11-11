import { MutationcheckoutEmailUpdateV2Args } from './types/2024-04'
import { MutationcartBuyerIdentityUpdateArgs, CartBuyerIdentityInput } from './types/2025-01'

type UpdateEmailInputMapper = {
  cartId: string,
  buyerIdentity: Pick<CartBuyerIdentityInput, 'email'>,
}

export const updateEmailInputMapper = (
  checkoutId: MutationcheckoutEmailUpdateV2Args['checkoutId'],
  email: MutationcheckoutEmailUpdateV2Args['email']
): MutationcartBuyerIdentityUpdateArgs => {
  const cartBuyerIdentityInput: UpdateEmailInputMapper = {
    buyerIdentity: { email },
    cartId: checkoutId,
  }

  return cartBuyerIdentityInput
}
