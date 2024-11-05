import assert from "assert";
import { removeGiftCardInputMapper } from "./removeGiftCard";

describe("removeGiftCardInputMapper", () => {
  describe("checkoutId", () => {
    it("maps checkoutId to cartId", () => {
      assert.deepStrictEqual(removeGiftCardInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef", ''), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef",
        appliedGiftCardIds: []
      });
    });
  });
  describe("appliedGiftCardId", () => {
    it("maps an empty appliedGiftCardId to appliedGiftCardIds", () => {
      assert.deepStrictEqual(removeGiftCardInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef", ''), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef",
        appliedGiftCardIds: []
      });
    })
    it("maps a single appliedGiftCardId to appliedGiftCardIds", () => {
      assert.deepStrictEqual(removeGiftCardInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef", 'gid://shopify/AppliedGiftCard/3af96c90098b2bfe22ccbd882daef'), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef",
        appliedGiftCardIds: ['gid://shopify/AppliedGiftCard/3af96c90098b2bfe22ccbd882daef']
      });
    })
  })
});
