import assert from "assert";
import { addDiscountInputMapper } from "./addDiscount";

describe("addDiscountInputMapper", () => {
  describe("checkoutId", () => {
    it("maps checkoutId to cartId", () => {
      assert.deepStrictEqual(addDiscountInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef45f?key=63066c9d54f3bc638445c276fab0401d", ''), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef45f?key=63066c9d54f3bc638445c276fab0401d",
        discountCodes: []
      });
    });
  });
  describe("discountCode", () => {
    it("maps discountCode to discountCodes", () => {
      assert.deepStrictEqual(addDiscountInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef", 'DISCOUNT_CODE'), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef",
        discountCodes: ['DISCOUNT_CODE']
      });
    })
  })
});
