import assert from "assert";
import { updateEmailInputMapper } from "./updateEmail";

describe("updateEmailInputMapper", () => {
  describe("checkoutId", () => {
    it("maps checkoutId to cartId", () => {
      assert.deepStrictEqual(updateEmailInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef45f?key=63066c9d54f3bc638445c276fab0401d", ''), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef45f?key=63066c9d54f3bc638445c276fab0401d",
        buyerIdentity: { email: '' }
      });
    });
  });
  describe("email", () => {
    it("maps email to buyerIdentity.email", () => {
      assert.deepStrictEqual(updateEmailInputMapper('', '123@shopify.com'), {
        cartId: '',
        buyerIdentity: { email: '123@shopify.com' }
      });
    });
  });
});
