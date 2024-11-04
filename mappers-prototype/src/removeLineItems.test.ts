import assert from "assert";
import { removeLineItemsInputMapper } from "./removeLineItems";

describe("removeLineItemsInputMapper", () => {
  describe("checkoutId", () => {
    it("maps checkoutId to cartId", () => {
      assert.deepStrictEqual(removeLineItemsInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef", []), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef",
        lineIds: []
      });
    });
  });
  describe("lineItemIds", () => {
    it("maps a single lineItemIds to lineIds", () => {
      assert.deepStrictEqual(removeLineItemsInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef", ["gid://shopify/LineItem/3af96c90098b2bfe22ccbd882daef"]), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef",
        lineIds: ["gid://shopify/LineItem/3af96c90098b2bfe22ccbd882daef"]
      });
    })
    it("maps multiple lineItemIds to lineIds", () => {
      assert.deepStrictEqual(removeLineItemsInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef", ["gid://shopify/LineItem/3af96c90098b2bfe22ccbd882daef", "gid://shopify/LineItem/3af96c90098b2bfe22ccbd882daef"]), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef",
        lineIds: ["gid://shopify/LineItem/3af96c90098b2bfe22ccbd882daef", "gid://shopify/LineItem/3af96c90098b2bfe22ccbd882daef"]
      });
    })
  });
});
