import assert from "assert";
import { addGiftCardsInputMapper, } from "./addGiftCards";

describe("addGiftCardsInputMapper", () => {
  describe("checkoutId", () => {
    it("maps checkoutId to cartId", () => {
      assert.deepStrictEqual(addGiftCardsInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef45f?key=63066c9d54f3bc638445c276fab0401d", []), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef45f?key=63066c9d54f3bc638445c276fab0401d",
        giftCardCodes: []
      });
    });
  });
  describe("giftCardCodes", () => {
    it("maps a single giftCardCode to giftCardCodes", () => {
      assert.deepStrictEqual(addGiftCardsInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef", ['GIFT_CARD_CODE']), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef",
        giftCardCodes: ['GIFT_CARD_CODE']
      });
    })
    it("maps multiple giftCardCodes to giftCardCodes", () => {
      assert.deepStrictEqual(addGiftCardsInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef", ['GIFT_CARD_CODE_1', 'GIFT_CARD_CODE_2']), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef",
        giftCardCodes: ['GIFT_CARD_CODE_1', 'GIFT_CARD_CODE_2']
      });
    })
  })
});
