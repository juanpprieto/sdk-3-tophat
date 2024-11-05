import assert from "assert";
import { updateShippingAddressInputMapper } from "./updateShippingAddress";

describe("updateShippingAddressInputMapper", () => {
  describe("checkoutId", () => {
    it("maps checkoutId to cartId", () => {
      assert.deepStrictEqual(updateShippingAddressInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef", {}), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef",
        buyerIdentity: {
          deliveryAddressPreferences: []
        }
      });
    });
  });
  describe("shippingAddress", () => {
    it("maps empty shippingAddress to empty deliveryAddress", () => {
      assert.deepStrictEqual(updateShippingAddressInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef", {}), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef",
        buyerIdentity: {
          deliveryAddressPreferences: []
        }
      });
    });

    it("maps shippingAddress to deliveryAddress", () => { 
      assert.deepStrictEqual(updateShippingAddressInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef", {
        address1: "123 Fake St",
        address2: "Apt 123",
        city: "Springfield",
        company: "Acme Inc",
        country: "US",
        firstName: "John",
        lastName: "Doe",
        phone: "555-555-5555",
        zip: "12345",
        province: "IL"
      }), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef",
        buyerIdentity: {
          deliveryAddressPreferences: [{
            deliveryAddress: {
              address1: "123 Fake St",
              address2: "Apt 123",
              city: "Springfield",
              company: "Acme Inc",
              country: "US",
              firstName: "John",
              lastName: "Doe",
              phone: "555-555-5555",
              zip: "12345",
              province: "IL"
            }
          }]
        }
      });
    });

    it("maps shippingAddress with missing fields to deliveryAddress", () => {
      assert.deepStrictEqual(updateShippingAddressInputMapper("gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef", {
        address1: "123 Fake St",
        city: "Springfield",
        country: "US",
        firstName: "John",
        lastName: "Doe",
        phone: "555-555-5555",
        zip: "12345"
      }), {
        cartId: "gid://shopify/Checkout/3af96c90098b2bfe22ccbd882daef",
        buyerIdentity: {
          deliveryAddressPreferences: [{
            deliveryAddress: {
              address1: "123 Fake St",
              city: "Springfield",
              country: "US",
              firstName: "John",
              lastName: "Doe",
              phone: "555-555-5555",
              zip: "12345"
            }
          }]
        }
      });
    });
  });
});
