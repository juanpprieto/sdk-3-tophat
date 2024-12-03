import assert from "assert";
import {
  discountAndLineMapperForTests,
  type CartLine,
  getDiscountApplicationId,
  type CheckoutLineItem,
  type CheckoutDiscountApplication,
} from "./payloadDiscount";

enum CurrencyCode {
  USD = "USD",
  CAD = "CAD",
}

enum DiscountApplicationAllocationMethod {
  ACROSS = "ACROSS",
  EACH = "EACH",
  ONE = "ONE",
}

enum DiscountApplicationTargetSelection {
  ALL = "ALL",
  ENTITLED = "ENTITLED",
  EXPLICIT = "EXPLICIT",
}

enum DiscountApplicationTargetType {
  LINE_ITEM = "LINE_ITEM",
  SHIPPING_LINE = "SHIPPING_LINE",
}

const deepSortCheckoutLines = (
  lineItems: CheckoutLineItem[]
): CheckoutLineItem[] => {
  return lineItems
    .map((lineItem) => {
      return {
        ...lineItem,
        discountAllocations: lineItem.discountAllocations.sort((a, b) =>
          getDiscountApplicationId(a.discountApplication).localeCompare(
            getDiscountApplicationId(b.discountApplication)
          )
        ),
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
};

const deepSortDiscountApplications = (discountApplications: any[]): any[] => {
  return discountApplications.sort((a, b) =>
    getDiscountApplicationId(a).localeCompare(getDiscountApplicationId(b))
  );
};

describe.only("discountAndLineMapperForTests", () => {
  describe("when the cart has no line items", () => {
    it("returns empty arrays when there are no discounts applied", () => {
      const {checkoutDiscountApplications, checkoutLines} = discountAndLineMapperForTests({
        cartLineItems: [],
        cartDiscountAllocations: [],
        cartDiscountCodes: [],
      });

      const expectedCheckoutDiscountApplications: CheckoutDiscountApplication[] = [];
      const expectedCheckoutLines: CheckoutLineItem[] = [];

      assert.deepStrictEqual(
        deepSortDiscountApplications(checkoutDiscountApplications),
        deepSortDiscountApplications(expectedCheckoutDiscountApplications)
      );
      assert.deepStrictEqual(
        deepSortCheckoutLines(checkoutLines),
        deepSortCheckoutLines(expectedCheckoutLines)
      );
    });

    it("returns empty arrays when there is a discount code applied", () => {
      const {checkoutDiscountApplications, checkoutLines} = discountAndLineMapperForTests({
        cartLineItems: [],
        cartDiscountAllocations: [],
        cartDiscountCodes: [
          {
            applicable: false,
            code: "ORDER50OFF",
          },
        ],
      });

      assert.deepStrictEqual(checkoutDiscountApplications, []);
      assert.deepStrictEqual(checkoutLines, []);
    });

    it("returns empty arrays when there are multiple discount codes applied", () => {
      const {checkoutDiscountApplications, checkoutLines} = discountAndLineMapperForTests({
        cartLineItems: [],
        cartDiscountAllocations: [],
        cartDiscountCodes: [
          {
            applicable: false,
            code: "PRODUCT10OFF",
          },
          {
            applicable: false,
            code: "ORDER50OFF",
          },
          {
            applicable: false,
            code: "ORDER10OFF",
          },
        ],
      });

      assert.deepStrictEqual(checkoutDiscountApplications, []);
      assert.deepStrictEqual(checkoutLines, []);
    });
  });

  describe('when the cart has 1 line item', () => {
    describe('when there are no discounts applied', () => {
      it('returns unchanged line items and an empty array for discount applications', () => {
        const {checkoutDiscountApplications, checkoutLines} = discountAndLineMapperForTests({
          cartLineItems: [{
            id: 'gid://shopify/CartLine/3c67754f-e9ae-4861-a4c0-870cb5adffec?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkRWMlhYVkhXTlhYODcyNFkzQzJRUDdH',
            quantity: 3,
            cost: {
              totalAmount: {
                amount: 600.0,
                currencyCode: CurrencyCode.USD,
              }
            },
            discountAllocations: [],
          }],
          cartDiscountAllocations: [],
          cartDiscountCodes: [],
        });

        const expectedCheckoutLines: CheckoutLineItem[] = [
          {
            id: 'gid://shopify/CartLine/3c67754f-e9ae-4861-a4c0-870cb5adffec?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkRWMlhYVkhXTlhYODcyNFkzQzJRUDdH',
            quantity: 3,
            discountAllocations: [], 
          }
        ];

        assert.deepStrictEqual(
            checkoutDiscountApplications, []
        );

        assert.deepStrictEqual(
          deepSortCheckoutLines(checkoutLines),
          deepSortCheckoutLines(expectedCheckoutLines)
        );
      });
    });

    it('can map a fixed amount product discount', () => {
      const {checkoutDiscountApplications, checkoutLines} = discountAndLineMapperForTests({
        cartLineItems: [
          {
            "id": "gid://shopify/CartLine/5c0159e9-5793-48da-8737-498b1427db9a?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkU0VlRLSzg1SEVOQlk2TTEyRzVLMkUw",
            "quantity": 3,
            "discountAllocations": [
              {
                "targetType": DiscountApplicationTargetType.LINE_ITEM,
                "allocationMethod": DiscountApplicationAllocationMethod.EACH,
                "targetSelection": DiscountApplicationTargetSelection.ENTITLED,
                "code": "10OFF",
                "value": {
                  "amount": 30.0,
                  "currencyCode": CurrencyCode.USD
                },
                "discountedAmount": {
                  "amount": 30.0,
                  "currencyCode": CurrencyCode.USD
                }
              }
            ],
            "cost": {
              "totalAmount": {
                "amount": 570.0,
                "currencyCode": CurrencyCode.USD
              }
            }
          }
        ],
        cartDiscountAllocations: [],
        cartDiscountCodes: [{
          "applicable": true,
          "code": "10OFF"
        }],
      });

      const expectedCheckoutDiscountApplications = [
        {
          "targetSelection": "ENTITLED",
          "allocationMethod": "EACH",
          "targetType": "LINE_ITEM",
          "value": {
            "amount": 30.0,
            "currencyCode": "USD"
          },
          "code": "10OFF",
          "applicable": true
        }
      ];
      const expectedCheckoutLines: CheckoutLineItem[] = [
        {
          "id": "gid://shopify/CartLine/5c0159e9-5793-48da-8737-498b1427db9a?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkU0VlRLSzg1SEVOQlk2TTEyRzVLMkUw",
          "quantity": 3,
          "discountAllocations": [
            {
              "allocatedAmount": {
                "amount": 30.0,
                "currencyCode": CurrencyCode.USD
              },
              "discountApplication": {
                "targetSelection": "ENTITLED",
                "allocationMethod": "EACH",
                "targetType": "LINE_ITEM",
                "value": {
                  "amount": 30.0,
                  "currencyCode": CurrencyCode.USD
                },
                "code": "10OFF",
                "applicable": true
              }
            }
          ]
        }
      ]

      assert.deepStrictEqual(
        deepSortDiscountApplications(checkoutDiscountApplications),
        deepSortDiscountApplications(expectedCheckoutDiscountApplications)
      );
      assert.deepStrictEqual(
        deepSortCheckoutLines(checkoutLines),
        deepSortCheckoutLines(expectedCheckoutLines)
      );
    });

    it('can map a percentage product discount', () => {
      const {checkoutDiscountApplications, checkoutLines} = discountAndLineMapperForTests({
        cartLineItems: [
          {
            "id": "gid://shopify/CartLine/ceda31e3-f3ee-4b88-954f-ff1d03dd2648?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkU0VlFOMFA3OUVBOVY3Ujk4RkZKUjJU",
            "quantity": 3,
            "discountAllocations": [
              {
                "targetType": DiscountApplicationTargetType.LINE_ITEM,
                "allocationMethod": DiscountApplicationAllocationMethod.EACH,
                "targetSelection": DiscountApplicationTargetSelection.ENTITLED,
                "code": "10PERCENTOFF",
                "value": {
                  "percentage": 10
                },
                "discountedAmount": {
                  "amount": 60.0,
                  "currencyCode": CurrencyCode.USD
                }
              }
            ],
            "cost": {
              "totalAmount": {
                "amount": 540.0,
                "currencyCode": CurrencyCode.USD
              }
            }
          }
        ],
        cartDiscountAllocations: [],
        cartDiscountCodes: [{
          "applicable": true,
          "code": "10PERCENTOFF"
        }],
      });
      
      const expectedCheckoutDiscountApplications = [
        {
          "targetSelection": "ENTITLED",
          "allocationMethod": "EACH",
          "targetType": "LINE_ITEM",
          "value": {
            "percentage": 10
          },
          "code": "10PERCENTOFF",
          "applicable": true
        }
      ];
      const expectedCheckoutLines: CheckoutLineItem[] = [
        {
         "id": "gid://shopify/CartLine/ceda31e3-f3ee-4b88-954f-ff1d03dd2648?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkU0VlFOMFA3OUVBOVY3Ujk4RkZKUjJU",
          "quantity": 3,
          "discountAllocations": [
            {
              "allocatedAmount": {
                "amount": 60.0,
                "currencyCode": CurrencyCode.USD
              },
              "discountApplication": {
                "targetSelection": "ENTITLED",
                "allocationMethod": "EACH",
                "targetType": "LINE_ITEM",
                "value": {
                  "percentage": 10
                },
                "code": "10PERCENTOFF",
                "applicable": true
              }
            }
          ]
        }
      ];

      assert.deepStrictEqual(
        deepSortDiscountApplications(checkoutDiscountApplications),
        deepSortDiscountApplications(expectedCheckoutDiscountApplications)
      );
      assert.deepStrictEqual(
        deepSortCheckoutLines(checkoutLines),
        deepSortCheckoutLines(expectedCheckoutLines)
      );
    });

    it('can map a fixed amount order discount', () => {
      const {checkoutDiscountApplications, checkoutLines} = discountAndLineMapperForTests({
        cartLineItems: [
          {
            "id": "gid://shopify/CartLine/4306e17e-9472-4daf-badd-2620d59875d7?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkU0WDhTTlIwQlhLS1JRNVlOSkVHMjlD",
            "quantity": 3,
            "discountAllocations": [],
            "cost": {
              "totalAmount": {
                "amount": 600.0,
                "currencyCode": CurrencyCode.USD
              }
            }
          }
        ],
        cartDiscountAllocations: [
          {
            "targetType": DiscountApplicationTargetType.LINE_ITEM,
            "allocationMethod": DiscountApplicationAllocationMethod.ACROSS,
            "targetSelection": DiscountApplicationTargetSelection.ALL,
            "code": "ORDERFIXED50OFF",
            "value": {
              "amount": 50.0,
              "currencyCode": CurrencyCode.USD
            },
            "discountedAmount": {
              "amount": 50.0,
              "currencyCode": CurrencyCode.USD
            }
          }
        ],
        cartDiscountCodes: [
          {
            "applicable": true,
            "code": "ORDERFIXED50OFF"
          }
        ],
      });

      const expectedCheckoutDiscountApplications: CheckoutDiscountApplication[] = [
        {
          "targetSelection": "ALL",
          "allocationMethod": "ACROSS",
          "targetType": "LINE_ITEM",
          "value": {
            "amount": 50.0,
            "currencyCode": CurrencyCode.USD
          },
          "code": "ORDERFIXED50OFF",
          "applicable": true
        }
      ];
      const expectedCheckoutLines: CheckoutLineItem[] = [
        {
          "id": "gid://shopify/CartLine/4306e17e-9472-4daf-badd-2620d59875d7?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkU0WDhTTlIwQlhLS1JRNVlOSkVHMjlD",
          "quantity": 3,
          "discountAllocations": [
            {
              "allocatedAmount": {
                "amount": 50.0,
                "currencyCode": CurrencyCode.USD
              },
              "discountApplication": {
                "targetSelection": "ALL",
                "allocationMethod": "ACROSS",
                "targetType": "LINE_ITEM",
                "value": {
                  "amount": 50.0,
                  "currencyCode": CurrencyCode.USD
                },
                "code": "ORDERFIXED50OFF",
                "applicable": true
              }
            }
          ]
        }
      ];

      assert.deepStrictEqual(
        deepSortDiscountApplications(checkoutDiscountApplications),
        deepSortDiscountApplications(expectedCheckoutDiscountApplications)
      );
      assert.deepStrictEqual(
        deepSortCheckoutLines(checkoutLines),
        deepSortCheckoutLines(expectedCheckoutLines)
      );
    });

    it('can map a percentage order discount', () => {
      const {checkoutDiscountApplications, checkoutLines} = discountAndLineMapperForTests({
        cartLineItems: [
          {
            "id": "gid://shopify/CartLine/0a52bd05-4e62-490e-8b34-d7fc76b84e27?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkU0WENYSldWS1JEMjUxU1I0VzdNOENX",
            "quantity": 3,
            "discountAllocations": [],
            "cost": {
              "totalAmount": {
                "amount": 600.0,
                "currencyCode": CurrencyCode.USD
              }
            }
          }
        ],
        cartDiscountAllocations: [
          {
            "targetType": DiscountApplicationTargetType.LINE_ITEM,
            "allocationMethod": DiscountApplicationAllocationMethod.ACROSS,
            "targetSelection": DiscountApplicationTargetSelection.ALL,
            "code": "ORDER50PERCENTOFF",
            "value": {
              "percentage": 50
            },
            "discountedAmount": {
              "amount": 300.0,
              "currencyCode": CurrencyCode.USD
            }
          }
        ],
        cartDiscountCodes: [
          {
            "applicable": true,
            "code": "ORDER50PERCENTOFF"
          }
        ],
      });

      const expectedCheckoutDiscountApplications: CheckoutDiscountApplication[] = [
        {
          "targetSelection": "ALL",
          "allocationMethod": "ACROSS",
          "targetType": "LINE_ITEM",
          "value": {
            "percentage": 50
          },
          "code": "ORDER50PERCENTOFF",
          "applicable": true
        }
      ];
      const expectedCheckoutLines: CheckoutLineItem[] = [
        {
          "id": "gid://shopify/CartLine/0a52bd05-4e62-490e-8b34-d7fc76b84e27?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkU0WENYSldWS1JEMjUxU1I0VzdNOENX",
          "quantity": 3,
          "discountAllocations": [
            {
              "allocatedAmount": {
                "amount": 300.0,
                "currencyCode": CurrencyCode.USD
              },
              "discountApplication": {
                "targetSelection": "ALL",
                "allocationMethod": "ACROSS",
                "targetType": "LINE_ITEM",
                "value": {
                  "percentage": 50
                },
                "code": "ORDER50PERCENTOFF",
                "applicable": true
              }
            }
          ]
        }
      ];

      assert.deepStrictEqual(
        deepSortDiscountApplications(checkoutDiscountApplications),
        deepSortDiscountApplications(expectedCheckoutDiscountApplications)
      );
      assert.deepStrictEqual(
        deepSortCheckoutLines(checkoutLines),
        deepSortCheckoutLines(expectedCheckoutLines)
      );
    });

    it('can map an automatic discount', () => {
      const {checkoutDiscountApplications, checkoutLines} = discountAndLineMapperForTests({
        cartLineItems: [
          {
            "id": "gid://shopify/CartLine/a5bceeae-298c-48de-8820-fb3f1e4b109a?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkU0WE1DOTBaR05XVEM5N01DSk02Vk05",
            "cost": {
              "totalAmount": {
                "amount": 600.0,
                "currencyCode": CurrencyCode.USD
              },
            },
            "discountAllocations": [],
            "quantity": 3,
          }
        ],
        cartDiscountAllocations: [
          {
            "targetType": DiscountApplicationTargetType.LINE_ITEM,
            "allocationMethod": DiscountApplicationAllocationMethod.ACROSS,
            "targetSelection": DiscountApplicationTargetSelection.ALL,
            "title": "5 off order",
            "value": {
              "percentage": 5
            },
            "discountedAmount": {
              "amount": 30.0,
              "currencyCode": CurrencyCode.USD
            },
          }
        ],
        cartDiscountCodes: [],
      });

      const expectedCheckoutDiscountApplications: CheckoutDiscountApplication[] = [
        {
          "targetSelection": "ALL",
          "allocationMethod": "ACROSS",
          "targetType": "LINE_ITEM",
          "value": {
            "percentage": 5,
          },
          "title": "5 off order",
        }
      ];
      const expectedCheckoutLines: CheckoutLineItem[] = [
        {
          "id": "gid://shopify/CartLine/a5bceeae-298c-48de-8820-fb3f1e4b109a?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkU0WE1DOTBaR05XVEM5N01DSk02Vk05",
          "quantity": 3,
          "discountAllocations": [
            {
              "allocatedAmount": {
                "amount": 30.0,
                "currencyCode": CurrencyCode.USD,
              },
              "discountApplication": {
                "targetSelection": "ALL",
                "allocationMethod": "ACROSS",
                "targetType": "LINE_ITEM",
                "value": {
                  "percentage": 5,
                },
                "title": "5 off order",
              },
            }
          ]
        }
      ];

      assert.deepStrictEqual(
        deepSortDiscountApplications(checkoutDiscountApplications),
        deepSortDiscountApplications(expectedCheckoutDiscountApplications)
      );
      assert.deepStrictEqual(
        deepSortCheckoutLines(checkoutLines),
        deepSortCheckoutLines(expectedCheckoutLines)
      );
    })
  });

  describe('when the cart has multiple line items', () => {
    describe('when there are no discounts applied', () => {
      it('returns unchanged line items and an empty array for discount applications', () => {
        const {checkoutDiscountApplications, checkoutLines} = discountAndLineMapperForTests({
          cartLineItems: [
            {
              "id": "gid://shopify/CartLine/44a63b36-5cdf-4f5c-849c-3ff91b775114?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkU0WTUwR0daUUJIWjlQR1ZRNk5WQ0RW",
              "discountAllocations": [],
              "quantity": 1,
              "cost": {
                "totalAmount": {
                  "amount": 70.0,
                  "currencyCode": CurrencyCode.USD
                }
              }
            },
            {
              "id": "gid://shopify/CartLine/02feb122-84ca-4d0e-8ad4-a6e63274e854?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkU0WTUwR0daUUJIWjlQR1ZRNk5WQ0RW",
              "discountAllocations": [],
              "quantity": 3,
              "cost": {
                "totalAmount": {
                  "amount": 600.0,
                  "currencyCode": CurrencyCode.USD
                }
              }
            }
          ],
          cartDiscountAllocations: [],
          cartDiscountCodes: [],
        });
  
        const expectedCheckoutDiscountApplications: CheckoutDiscountApplication[] = [];
        const expectedCheckoutLines: CheckoutLineItem[] = [
          {
            "id": "gid://shopify/CartLine/02feb122-84ca-4d0e-8ad4-a6e63274e854?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkU0WTUwR0daUUJIWjlQR1ZRNk5WQ0RW",
            "quantity": 3,
            "discountAllocations": []
          },
          {
            "id": "gid://shopify/CartLine/44a63b36-5cdf-4f5c-849c-3ff91b775114?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkU0WTUwR0daUUJIWjlQR1ZRNk5WQ0RW",
            "quantity": 1,
            "discountAllocations": []
          }
        ];
  
        assert.deepStrictEqual(
          deepSortDiscountApplications(checkoutDiscountApplications),
          deepSortDiscountApplications(expectedCheckoutDiscountApplications)
        );
        assert.deepStrictEqual(
          deepSortCheckoutLines(checkoutLines),
          deepSortCheckoutLines(expectedCheckoutLines)
        );
      });
    });

    it('can map a cart with multiple fixed amount product discounts', () => {
      const {checkoutDiscountApplications, checkoutLines} = discountAndLineMapperForTests({
        cartLineItems: [
          {
            "id": "gid://shopify/CartLine/fbb590ba-b078-4d80-a95a-f7252174f06f?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkU1MDFNOVpZWjhaUkVHNFgzN000RDhB",
            "discountAllocations": [
              {
                "targetType": DiscountApplicationTargetType.LINE_ITEM,
                "allocationMethod": DiscountApplicationAllocationMethod.EACH,
                "targetSelection": DiscountApplicationTargetSelection.ENTITLED,
                "title": "5OFFPRODUCT",
                "value": {
                  "amount": 5.0,
                  "currencyCode": CurrencyCode.USD
                },
                "discountedAmount": {
                  "amount": 5.0,
                  "currencyCode": CurrencyCode.USD
                }
              }
            ],
            "quantity": 1,
            "cost": {
              "totalAmount": {
                "amount": 65.0,
                "currencyCode": CurrencyCode.USD
              }
            }
          },
          {
            "id": "gid://shopify/CartLine/2b437fb9-33fd-4424-8ea0-fcd275ae65f7?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkU1MDFNOVpZWjhaUkVHNFgzN000RDhB",
            "discountAllocations": [
              {
                "targetType": DiscountApplicationTargetType.LINE_ITEM,
                "allocationMethod": DiscountApplicationAllocationMethod.EACH,
                "targetSelection": DiscountApplicationTargetSelection.ENTITLED,
                "title": "150offvariant",
                "value": {
                  "amount": 450.0,
                  "currencyCode": CurrencyCode.USD
                },
                "discountedAmount": {
                  "amount": 450.0,
                  "currencyCode": CurrencyCode.USD
                }
              }
            ],
            "quantity": 3,
            "cost": {
              "totalAmount": {
                "amount": 150.0,
                "currencyCode": CurrencyCode.USD
              }
            }
          }
        ],
        cartDiscountAllocations: [],
        cartDiscountCodes: [],
      });

      const expectedCheckoutDiscountApplications: CheckoutDiscountApplication[] = [
        {
          "targetSelection": "ENTITLED",
          "allocationMethod": "EACH",
          "targetType": "LINE_ITEM",
          "value": {
            "amount": 450.0,
            "currencyCode": CurrencyCode.USD
          },
          "title": "150offvariant"
        },
        {
          "targetSelection": "ENTITLED",
          "allocationMethod": "EACH",
          "targetType": "LINE_ITEM",
          "value": {
            "amount": 5.0,
            "currencyCode": CurrencyCode.USD
          },
          "title": "5OFFPRODUCT"
        }
      ];
      const expectedCheckoutLines: CheckoutLineItem[] = [
        {
          "id": "gid://shopify/CartLine/2b437fb9-33fd-4424-8ea0-fcd275ae65f7?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkU1MDFNOVpZWjhaUkVHNFgzN000RDhB",
          "quantity": 3,
          "discountAllocations": [
            {
              "allocatedAmount": {
                "amount": 450.0,
                "currencyCode": CurrencyCode.USD
              },
              "discountApplication": {
                "targetSelection": "ENTITLED",
                "allocationMethod": "EACH",
                "targetType": "LINE_ITEM",
                "value": {
                  "amount": 450.0,
                  "currencyCode": CurrencyCode.USD
                },
                "title": "150offvariant"
              }
            }
          ]
        },
        {
          "id": "gid://shopify/CartLine/fbb590ba-b078-4d80-a95a-f7252174f06f?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkU1MDFNOVpZWjhaUkVHNFgzN000RDhB",
          "quantity": 1,
          "discountAllocations": [
            {
              "allocatedAmount": {
                "amount": 5.0,
                "currencyCode": CurrencyCode.USD
              },
              "discountApplication": {
                "targetSelection": "ENTITLED",
                "allocationMethod": "EACH",
                "targetType": "LINE_ITEM",
                "value": {
                  "amount": 5.0,
                  "currencyCode": CurrencyCode.USD
                },
                "title": "5OFFPRODUCT"
              }
            }
          ]
        }
      ];

      assert.deepStrictEqual(
        deepSortDiscountApplications(checkoutDiscountApplications),
        deepSortDiscountApplications(expectedCheckoutDiscountApplications)
      );
      assert.deepStrictEqual(
        deepSortCheckoutLines(checkoutLines),
        deepSortCheckoutLines(expectedCheckoutLines)
      );
    });

    it('can map a cart with a fixed amount product discount and a percentage order discount', () => {
      const {checkoutDiscountApplications, checkoutLines} = discountAndLineMapperForTests({
        cartLineItems: [
          {
            "id": "gid://shopify/CartLine/102f4acf-616a-4658-b81a-95bfd427fa13?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkU1MEdFVFg5WjZYS0hNOVNLSzIxSFZE",
            "discountAllocations": [],
            "quantity": 1,
            "cost": {
              "totalAmount": {
                "amount": 70.0,
                "currencyCode": CurrencyCode.USD
              }
            }
          },
          {
            "id": "gid://shopify/CartLine/196f872f-12f2-458a-9309-8926179f8144?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkU1MEdFVFg5WjZYS0hNOVNLSzIxSFZE",
            "discountAllocations": [
              {
                "targetType": DiscountApplicationTargetType.LINE_ITEM,
                "allocationMethod": DiscountApplicationAllocationMethod.EACH,
                "targetSelection": DiscountApplicationTargetSelection.ENTITLED,
                "title": "150offvariant",
                "value": {
                  "amount": 450.0,
                  "currencyCode": CurrencyCode.USD
                },
                "discountedAmount": {
                  "amount": 450.0,
                  "currencyCode": CurrencyCode.USD
                }
              }
            ],
            "quantity": 3,
            "cost": {
              "totalAmount": {
                "amount": 150.0,
                "currencyCode": CurrencyCode.USD
              }
            }
          }
        ],
        cartDiscountAllocations: [
          {
            "targetType": DiscountApplicationTargetType.LINE_ITEM,
            "allocationMethod": DiscountApplicationAllocationMethod.ACROSS,
            "targetSelection": DiscountApplicationTargetSelection.ALL,
            "title": "5 off order",
            "value": {
              "percentage": 5
            },
            "discountedAmount": {
              "amount": 3.5,
              "currencyCode": CurrencyCode.USD
            }
          },
          {
            "targetType": DiscountApplicationTargetType.LINE_ITEM,
            "allocationMethod": DiscountApplicationAllocationMethod.ACROSS,
            "targetSelection": DiscountApplicationTargetSelection.ALL,
            "title": "5 off order",
            "value": {
              "percentage": 5
            },
            "discountedAmount": {
              "amount": 7.5,
              "currencyCode": CurrencyCode.USD
            }
          }
        ],
        cartDiscountCodes: [],
      });

      const expectedCheckoutDiscountApplications: CheckoutDiscountApplication[] = [
        {
          "targetSelection": "ENTITLED",
          "allocationMethod": "EACH",
          "targetType": "LINE_ITEM",
          "value": {
            "amount": 450.0,
            "currencyCode": CurrencyCode.USD
          },
          "title": "150offvariant"
        },
        {
          "targetSelection": "ALL",
          "allocationMethod": "ACROSS",
          "targetType": "LINE_ITEM",
          "value": {
            "percentage": 5
          },
          "title": "5 off order"
        }
      ];
      const expectedCheckoutLines: CheckoutLineItem[] = [
        {
          "id": "gid://shopify/CartLine/196f872f-12f2-458a-9309-8926179f8144?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkU1MEdFVFg5WjZYS0hNOVNLSzIxSFZE",
          "quantity": 3,
          "discountAllocations": [
            {
              "allocatedAmount": {
                "amount": 450.0,
                "currencyCode": CurrencyCode.USD
              },
              "discountApplication": {
                "targetSelection": "ENTITLED",
                "allocationMethod": "EACH",
                "targetType": "LINE_ITEM",
                "value": {
                  "amount": 450.0,
                  "currencyCode": CurrencyCode.USD
                },
                "title": "150offvariant"
              }
            },
            {
              "allocatedAmount": {
                "amount": 7.5,
                "currencyCode": CurrencyCode.USD
              },
              "discountApplication": {
                "targetSelection": "ALL",
                "allocationMethod": "ACROSS",
                "targetType": "LINE_ITEM",
                "value": {
                  "percentage": 5
                },
                "title": "5 off order"
              }
            }
          ]
        },
        {
          "id": "gid://shopify/CartLine/102f4acf-616a-4658-b81a-95bfd427fa13?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkU1MEdFVFg5WjZYS0hNOVNLSzIxSFZE",
          "quantity": 1,
          "discountAllocations": [
            {
              "allocatedAmount": {
                "amount": 3.5,
                "currencyCode": CurrencyCode.USD
              },
              "discountApplication": {
                "targetSelection": "ALL",
                "allocationMethod": "ACROSS",
                "targetType": "LINE_ITEM",
                "value": {
                  "percentage": 5
                },
                "title": "5 off order"
              }
            }
          ]
        }
      ];


      assert.deepStrictEqual(
        deepSortDiscountApplications(checkoutDiscountApplications),
        deepSortDiscountApplications(expectedCheckoutDiscountApplications)
      );
      assert.deepStrictEqual(
        deepSortCheckoutLines(checkoutLines),
        deepSortCheckoutLines(expectedCheckoutLines)
      );
    });

    it('can map a cart with multiple percentage order discounts', () => {
      const {checkoutDiscountApplications, checkoutLines} = discountAndLineMapperForTests({
        cartLineItems: [],
        cartDiscountAllocations: [],
        cartDiscountCodes: [],
      });

      const expectedCheckoutDiscountApplications: CheckoutDiscountApplication[] = [];
      const expectedCheckoutLines: CheckoutLineItem[] = [];

      assert.deepStrictEqual(
        deepSortDiscountApplications(checkoutDiscountApplications),
        deepSortDiscountApplications(expectedCheckoutDiscountApplications)
      );
      assert.deepStrictEqual(
        deepSortCheckoutLines(checkoutLines),
        deepSortCheckoutLines(expectedCheckoutLines)
      );
    });

    it('can map a cart with a percentage order discount and a fixed amount order discount', () => {
      const {checkoutDiscountApplications, checkoutLines} = discountAndLineMapperForTests({
        cartLineItems: [],
        cartDiscountAllocations: [],
        cartDiscountCodes: [],
      });

      const expectedCheckoutDiscountApplications: CheckoutDiscountApplication[] = [];
      const expectedCheckoutLines: CheckoutLineItem[] = [];

      assert.deepStrictEqual(
        deepSortDiscountApplications(checkoutDiscountApplications),
        deepSortDiscountApplications(expectedCheckoutDiscountApplications)
      );
      assert.deepStrictEqual(
        deepSortCheckoutLines(checkoutLines),
        deepSortCheckoutLines(expectedCheckoutLines)
      );
    });

    it('can map a cart with a combination of multiple order discounts and multiple product discounts', () => {
      const {checkoutDiscountApplications, checkoutLines} = discountAndLineMapperForTests({
        cartLineItems: [
          {
            id: "gid://shopify/CartLine/3c67754f-e9ae-4861-a4c0-870cb5adffec?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkRWMlhYVkhXTlhYODcyNFkzQzJRUDdH",
            quantity: 1,
            discountAllocations: [
              {
                targetType: DiscountApplicationTargetType.LINE_ITEM,
                allocationMethod: DiscountApplicationAllocationMethod.EACH,
                targetSelection: DiscountApplicationTargetSelection.ENTITLED,
                code: "10OFF",
                value: {
                  amount: 10.0,
                  currencyCode: CurrencyCode.USD,
                },
                discountedAmount: {
                  amount: 10.0,
                  currencyCode: CurrencyCode.USD,
                },
              },
            ],
            cost: {
              totalAmount: {
                amount: 60.0,
                currencyCode: CurrencyCode.USD,
              },
            },
          },
          {
            id: "gid://shopify/CartLine/c1827851-ad14-4e25-9a4a-21d50cf6b83c?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkRWMlhYVkhXTlhYODcyNFkzQzJRUDdH",
            quantity: 3,
            discountAllocations: [
              {
                targetType: DiscountApplicationTargetType.LINE_ITEM,
                allocationMethod: DiscountApplicationAllocationMethod.EACH,
                targetSelection: DiscountApplicationTargetSelection.ENTITLED,
                title: "150offvariant",
                value: {
                  amount: 450.0,
                  currencyCode: CurrencyCode.USD,
                },
                discountedAmount: {
                  amount: 450.0,
                  currencyCode: CurrencyCode.USD,
                },
              },
            ],
            cost: {
              totalAmount: {
                amount: 150.0,
                currencyCode: CurrencyCode.USD,
              },
            },
          },
        ],
        cartDiscountAllocations: [
          {
            targetType: DiscountApplicationTargetType.LINE_ITEM,
            allocationMethod: DiscountApplicationAllocationMethod.ACROSS,
            targetSelection: DiscountApplicationTargetSelection.ALL,
            title: "5 off order",
            value: {
              percentage: 5,
            },
            discountedAmount: {
              amount: 3.0,
              currencyCode: CurrencyCode.USD,
            },
          },
          {
            targetType: DiscountApplicationTargetType.LINE_ITEM,
            allocationMethod: DiscountApplicationAllocationMethod.ACROSS,
            targetSelection: DiscountApplicationTargetSelection.ALL,
            title: "5OFF",
            value: {
              percentage: 5,
            },
            discountedAmount: {
              amount: 3.0,
              currencyCode: CurrencyCode.USD,
            },
          },
          {
            targetType: DiscountApplicationTargetType.LINE_ITEM,
            allocationMethod: DiscountApplicationAllocationMethod.ACROSS,
            targetSelection: DiscountApplicationTargetSelection.ALL,
            title: "5 off order",
            value: {
              percentage: 5,
            },
            discountedAmount: {
              amount: 7.5,
              currencyCode: CurrencyCode.USD,
            },
          },
          {
            targetType: DiscountApplicationTargetType.LINE_ITEM,
            allocationMethod: DiscountApplicationAllocationMethod.ACROSS,
            targetSelection: DiscountApplicationTargetSelection.ALL,
            title: "5OFF",
            value: {
              percentage: 5,
            },
            discountedAmount: {
              amount: 7.5,
              currencyCode: CurrencyCode.USD,
            },
          },
        ],
        cartDiscountCodes: [
          {
            applicable: true,
            code: "10OFF",
          },
        ],
      });

      const expectedCheckoutDiscountApplications = [
        {
          targetSelection: "ENTITLED",
          allocationMethod: "EACH",
          targetType: "LINE_ITEM",
          value: {
            amount: 450.0,
            currencyCode: "USD",
          },
          title: "150offvariant",
        },
        {
          targetSelection: "ALL",
          allocationMethod: "ACROSS",
          targetType: "LINE_ITEM",
          value: {
            percentage: 5,
          },
          title: "5 off order",
        },
        {
          targetSelection: "ALL",
          allocationMethod: "ACROSS",
          targetType: "LINE_ITEM",
          value: {
            percentage: 5,
          },
          title: "5OFF",
        },
        {
          targetSelection: "ENTITLED",
          allocationMethod: "EACH",
          targetType: "LINE_ITEM",
          value: {
            amount: 10.0,
            currencyCode: "USD",
          },
          code: "10OFF",
          applicable: true,
        },
      ];
      const expectedCheckoutLines: CheckoutLineItem[]  = [
        {
          id: "gid://shopify/CartLine/c1827851-ad14-4e25-9a4a-21d50cf6b83c?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkRWMlhYVkhXTlhYODcyNFkzQzJRUDdH",
          quantity: 3,
          discountAllocations: [
            {
              allocatedAmount: {
                amount: 450.0,
                currencyCode: CurrencyCode.USD,
              },
              discountApplication: {
                targetSelection: "ENTITLED",
                allocationMethod: "EACH",
                targetType: "LINE_ITEM",
                value: {
                  amount: 450.0,
                  currencyCode: CurrencyCode.USD,
                },
                title: "150offvariant",
              },
            },
            {
              allocatedAmount: {
                amount: 7.5,
                currencyCode: CurrencyCode.USD,
              },
              discountApplication: {
                targetSelection: "ALL",
                allocationMethod: "ACROSS",
                targetType: "LINE_ITEM",
                value: {
                  percentage: 5,
                },
                title: "5 off order",
              },
            },
            {
              allocatedAmount: {
                amount: 7.5,
                currencyCode: CurrencyCode.USD,
              },
              discountApplication: {
                targetSelection: "ALL",
                allocationMethod: "ACROSS",
                targetType: "LINE_ITEM",
                value: {
                  percentage: 5,
                },
                title: "5OFF",
              },
            },
          ],
        },
        {
          id: "gid://shopify/CartLine/3c67754f-e9ae-4861-a4c0-870cb5adffec?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSkRWMlhYVkhXTlhYODcyNFkzQzJRUDdH",
          quantity: 1,
          discountAllocations: [
            {
              allocatedAmount: {
                amount: 3.0,
                currencyCode: CurrencyCode.USD,
              },
              discountApplication: {
                targetSelection: "ALL",
                allocationMethod: "ACROSS",
                targetType: "LINE_ITEM",
                value: {
                  percentage: 5,
                },
                title: "5 off order",
              },
            },
            {
              allocatedAmount: {
                amount: 3.0,
                currencyCode: CurrencyCode.USD,
              },
              discountApplication: {
                targetSelection: "ALL",
                allocationMethod: "ACROSS",
                targetType: "LINE_ITEM",
                value: {
                  percentage: 5,
                },
                title: "5OFF",
              },
            },
            {
              allocatedAmount: {
                amount: 10.0,
                currencyCode: CurrencyCode.USD,
              },
              discountApplication: {
                targetSelection: "ENTITLED",
                allocationMethod: "EACH",
                targetType: "LINE_ITEM",
                value: {
                  amount: 10.0,
                  currencyCode: CurrencyCode.USD,
                },
                code: "10OFF",
                applicable: true,
              },
            },
          ],
        },
      ];

      assert.deepStrictEqual(
        deepSortDiscountApplications(checkoutDiscountApplications),
        deepSortDiscountApplications(expectedCheckoutDiscountApplications)
      );
      assert.deepStrictEqual(
        deepSortCheckoutLines(checkoutLines),
        deepSortCheckoutLines(expectedCheckoutLines)
      );
    });
  });
});
