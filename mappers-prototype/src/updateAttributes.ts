import {CheckoutAttributesUpdateV2Input} from './types/2024-04'
import {AttributeInput} from './types/2024-10'

type CartAttributesUpdateInput = {
  attributes: Array<AttributeInput>;
  cartId: string,
}

type CartNoteUpdateInput = {
  cartId: string,
  note: string,
}

type CartAttributesNoteUpdateInputMapper = {
  cartAttributesUpdateInput: CartAttributesUpdateInput;
  cartNoteUpdateInput: CartNoteUpdateInput;
}

/**
 * This method maps the `CheckoutAttributesUpdateV2Input` to the `CartAttributesUpdateInput` and `CartNoteUpdateInput`
 * @param checkoutId - The checkoutId to update
 * @param input - The input to update the attributes
 * @returns The mapped `CartAttributesUpdateInput` and `CartNoteUpdateInput`
 */
export const updateAttributesInputMapper = (checkoutId: string, input: CheckoutAttributesUpdateV2Input): CartAttributesNoteUpdateInputMapper => {
  const cartAttributesUpdateInput: CartAttributesUpdateInput = {
    attributes: [],
    cartId: '',
  }

  const cartNoteUpdateInput: CartNoteUpdateInput = {
    cartId: '',
    note: '',
  }

  if (input.allowPartialAddresses) {
    // Ignoring `allowPartialAddresses` for now
  }

  if (checkoutId) {
    cartAttributesUpdateInput.cartId = checkoutId
    cartNoteUpdateInput.cartId = checkoutId
  }

  if (input.customAttributes) {
    cartAttributesUpdateInput.attributes = input.customAttributes
  }

  if (input.note) {
    cartNoteUpdateInput.note = input.note
  }

  // With cart, we will need to execute two separate mutations (one for attributes and one for note)
  return {cartAttributesUpdateInput, cartNoteUpdateInput}
}
