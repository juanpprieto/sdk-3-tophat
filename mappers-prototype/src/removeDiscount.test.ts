import assert from "assert";
import { removeDiscountInputMapper } from "./removeDiscount";

describe("removeDiscountInputMapper", () => {
  describe("checkoutId", () => {
    it("maps checkoutId to cartId", () => {
      assert.deepStrictEqual(removeDiscountInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef"), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef",
        discountCodes: []
      });
    });
  });
  describe("discountCode", () => {
    it("returns empty discountCodes", () => {
      assert.deepStrictEqual(removeDiscountInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef"), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef",
        discountCodes: []
      });
    })
  })
});
