import assert from "assert";
import { addDiscountInputMapper } from "./addDiscount";
import { addDiscountOutputMapper } from "./addDiscount";
import { Cart } from "./types/2025-01";

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

describe("addDiscountOutputMapper", () => {
  it("it maps an empty checkout with a fixed discount code", () => {
    const cart = {
      discountAllocations: [],
      discountCodes: [
        {
          applicable: false,
          code: "10PERCENTOFF"
        }
      ]
    } as unknown as Cart;
    const checkout = {
      discountApplications: []
    }
    assert.strictEqual(addDiscountOutputMapper(cart), checkout);
  });
});
