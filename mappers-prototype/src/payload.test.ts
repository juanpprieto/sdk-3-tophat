import assert from "assert";
import {
  emailMapper,
  idMapper,
  paymentDueMapper,
  subtotalPriceMapper,
} from "./payload";

enum CurrencyCode {
  USD = "USD",
  CAD = "CAD",
}

describe("emailMapper", () => {
  it("returns buyer's email", () => {
    assert.strictEqual(
      emailMapper({
        email: "buyer@test.com",
        deliveryAddressPreferences: [],
      }),
      "buyer@test.com"
    );
  });
  it("returns null if buyer's email is not present", () => {
    assert.strictEqual(
      emailMapper({
        deliveryAddressPreferences: [],
      }),
      null
    );
  });
});

describe("idMapper", () => {
  it("maps cart ID to checkout ID", () => {
    assert.strictEqual(
      idMapper(
        "gid://shopify/Cart/Z2NwLXVzLWNlbnRyYWwxOjAxSkNFV1ROTkZORzJZOUg5V1gwWTI1RDRL?key=d4438dd09137256a69a03e246c531b86"
      ),
      "gid://shopify/Checkout/Z2NwLXVzLWNlbnRyYWwxOjAxSkNFV1ROTkZORzJZOUg5V1gwWTI1RDRL?key=d4438dd09137256a69a03e246c531b86"
    );
  });
});

describe("paymentDueMapper", () => {
  it("returns cart's total cost when there are no applied gift cards", () => {
    const cartTotalCost = {
      amount: 100,
      currencyCode: CurrencyCode.USD,
    };

    assert.deepStrictEqual(paymentDueMapper(cartTotalCost, []), cartTotalCost);
  });

  it("returns cart's total cost minus applied gift cards", () => {
    const cartTotalCost = {
      amount: 50,
      currencyCode: CurrencyCode.USD,
    };

    const giftCard10Cad = {
      amountUsed: {
        amount: 10,
        currencyCode: CurrencyCode.CAD,
      },
      amountUsedV2: {
        amount: 10,
        currencyCode: CurrencyCode.CAD,
      },
      balance: {
        amount: 0,
        currencyCode: CurrencyCode.CAD,
      },
      balanceV2: {
        amount: 0,
        currencyCode: CurrencyCode.CAD,
      },
      id: "gid://shopify/AppliedGiftCard/123",
      lastCharacters: "123",
      presentmentAmountUsed: {
        amount: 7.18,
        currencyCode: CurrencyCode.USD,
      },
    };

    const giftCard15Usd = {
      amountUsed: {
        amount: 15,
        currencyCode: CurrencyCode.USD,
      },
      amountUsedV2: {
        amount: 15,
        currencyCode: CurrencyCode.USD,
      },
      balance: {
        amount: 0,
        currencyCode: CurrencyCode.USD,
      },
      balanceV2: {
        amount: 0,
        currencyCode: CurrencyCode.USD,
      },
      id: "gid://shopify/AppliedGiftCard/456",
      lastCharacters: "456",
      presentmentAmountUsed: {
        amount: 15,
        currencyCode: CurrencyCode.USD,
      },
    };

    assert.deepStrictEqual(
      paymentDueMapper(cartTotalCost, [giftCard10Cad, giftCard15Usd]),
      {
        amount: 27.82,
        currencyCode: CurrencyCode.USD,
      }
    );
  });
});

describe("subtotalPriceMapper", () => {
  it("returns cart's total amount with duties and taxes subtracted", () => {
    const cartCost = {
      checkoutChargeAmount: { amount: 45, currencyCode: CurrencyCode.USD },
      subtotalAmount: { amount: 39, currencyCode: CurrencyCode.USD },
      subtotalAmountEstimated: false,
      totalAmount: { amount: 317, currencyCode: CurrencyCode.USD },
      totalAmountEstimated: false,
      totalDutyAmount: { amount: 10, currencyCode: CurrencyCode.USD },
      totalDutyAmountEstimated: false,
      totalTaxAmount: { amount: 15, currencyCode: CurrencyCode.USD },
      totalTaxAmountEstimated: false,
    };

    assert.deepStrictEqual(subtotalPriceMapper(cartCost), {
      amount: 292,
      currencyCode: CurrencyCode.USD,
    });
  });

  it("returns cart's total amount when there are no duties and taxes", () => {
    const cartCost = {
      checkoutChargeAmount: { amount: 45, currencyCode: CurrencyCode.USD },
      subtotalAmount: { amount: 39, currencyCode: CurrencyCode.USD },
      subtotalAmountEstimated: false,
      totalAmount: { amount: 317, currencyCode: CurrencyCode.USD },
      totalAmountEstimated: false,
      totalDutyAmountEstimated: false,
      totalTaxAmount: { amount: 0, currencyCode: CurrencyCode.USD },
      totalTaxAmountEstimated: false,
    };
    assert.deepStrictEqual(subtotalPriceMapper(cartCost), {
      amount: 317,
      currencyCode: CurrencyCode.USD,
    });
  });
});
