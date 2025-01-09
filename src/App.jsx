import './App.css'
import { CheckoutCreate } from './CheckoutCreate'
import { useState } from 'react'
import { client } from './sdk'
import { CheckoutDiscounts } from './CheckoutDiscounts'
import { CheckoutGiftCards } from './CheckoutGiftCards'

function App() {
  const [checkout, setCheckout] = useState(null)
  const showCreateTests = true
  return (
    <div style={{ textAlign: 'left' }}>
      <h1>SDK 3.0 Checkout Tophat</h1>

      <hr />
      <CheckoutCreate checkout={checkout} setCheckout={setCheckout} verbose={showCreateTests} />
      <CheckoutUpdate checkout={checkout} setCheckout={setCheckout} />
      <CheckoutDiscounts checkout={checkout} setCheckout={setCheckout} />
      <CheckoutGiftCards checkout={checkout} setCheckout={setCheckout} />
      <CheckoutShippingAddress checkout={checkout} setCheckout={setCheckout} />
    </div>
  )
}

function CheckoutShippingAddress({ checkout, setCheckout }) {
  return (
    <div>
      <br />
      <br />
      <h1>Checkout Shipping Address</h1>
      <button onClick={async () => {
        client.checkout.updateShippingAddress(checkout?.id, {
          address1: '24 Westwind Street',
          address2: 'Apt C',
          city: 'Marina Del Rey',
          company: 'Fake Company',
          country: 'United States',
          firstName: 'Juan',
          lastName: 'Prieto',
          phone: '4240-537-8776',
          province: 'California',
          zip: '90292'
        }).then((checkout) => {
          console.log('Shipping address updated:', checkout)
          setCheckout(checkout)
        })
      }}>
        Update Shipping Address
      </button>
    </div>
  )
}

function CheckoutUpdate({ checkout, setCheckout }) {
  return (
    <div>
      <br />
      <br />
      <h1>Checkout Update</h1>
      <a href={checkout?.webUrl} target="_blank">Open Checkout</a>
      <button onClick={async () => {
        client.checkout.addLineItems(checkout?.id, [
          {
            variantId: 'gid://shopify/ProductVariant/48535896555542',
            quantity: 1
          }
        ]).then((checkout) => {
          console.log('Item added:', checkout)
          setCheckout(checkout)
        })
      }}>
        Add another item to checkout
      </button>
      <button onClick={async () => {
        client.checkout.updateAttributes(checkout?.id, {
          customAttributes: [
            { key: 'key1', value: 'value1' },
            { key: 'key2', value: 'value2' }
          ]
        }).then((checkout) => {
          console.log('Item added:', checkout)
          setCheckout(checkout)
        })
      }}>
        Update attributes
      </button>
      <button onClick={async () => {
        client.checkout.updateAttributes(checkout?.id, {
          customAttributes: [
            { key: 'key1', value: 'value1' },
            { key: 'key2', value: 'value2' }

          ],
          note: 'This is a note'
        }).then((checkout) => {
          console.log('Item added:', checkout)
          setCheckout(checkout)
        })
      }}>
        Update attributes + note
      </button>
      <button onClick={async () => {
        client.checkout.updateAttributes(checkout?.id, { note: 'test' }).then((checkout) => {
          console.log('Item added:', checkout)
          setCheckout(checkout)
        })
      }}>
        Update attributes (note)
      </button>

      <button onClick={async () => {
        client.checkout.updateEmail(checkout?.id, 'john.doe@shopify.com').then((checkout) => {
          console.log('Item added:', checkout)
          setCheckout(checkout)
        })
      }}>
        Update Email
      </button>
      <button onClick={async () => {
        client.checkout.addGiftCards(checkout?.id, ['100offgiftcard']).then((checkout) => {
          console.log('Item added:', checkout)
          setCheckout(checkout)
        })
      }}>
        Add Gift Card
      </button>
      <button onClick={async () => {
        client.checkout.addGiftCards(checkout?.id, ['100offgiftcard', '50offgiftcard']).then((checkout) => {
          console.log('Item added:', checkout)
          setCheckout(checkout)
        })
      }}>
        Add Gift Cards (2)
      </button>
     
      <button onClick={async () => {
        client.checkout.replaceLineItems(checkout?.id, [
          {
            variantId: "gid://shopify/ProductVariant/48535896490006",
            quantity: 1
          }
        ]).then((checkout) => {
          console.log('Item added:', checkout)
          setCheckout(checkout)
        })
      }}>
        Replace Line Items
      </button>

      <button onClick={async () => {
        client.checkout.updateLineItems(checkout?.id, [
          {
            // lineItem id (not variantId)
            id: checkout.lineItems[0].id,
            quantity: 2
          }
        ]).then((checkout) => {
          console.log('Item added:', checkout)
          setCheckout(checkout)
        })
      }}>
        Update Line Item Quantity
      </button>
      <button onClick={async () => {
        client.checkout.replaceLineItems(checkout?.id, [
          {
            variantId: "gid://shopify/ProductVariant/48535896457238",
            quantity: 1
          }
        ]).then((checkout) => {
          console.log('Item added:', checkout)
          setCheckout(checkout)
        })
      }}>
        Replace Line Items
      </button>
      <button onClick={async () => {
        client.checkout.removeLineItems(checkout?.id, [checkout.lineItems[0].id]).then((checkout) => {
          console.log('Item removed:', checkout)
          setCheckout(checkout)
        })}}>
          Remove Line Item
      </button>
      <button onClick={async () => {
        client.checkout.removeLineItems(checkout?.id, checkout.lineItems.map((item) => item.id)).then((checkout) => {
          console.log('All items removed:', checkout)
          setCheckout(checkout)
        }
      )}
      }>
        Remove All Line Items
      </button>
      <button onClick={async () => {
        client.checkout.updateLineItems(checkout?.id, [
          {
            id: checkout.lineItems[0].id,
            quantity: 2
          }
        ]).then((checkout) => {
          console.log('Item updated:', checkout)
          setCheckout(checkout)
        })
      }}>
          Update Line Item Quantity
       </button>
      <button onClick={async () => {
        client.checkout.updateLineItems(checkout?.id, [
          {
            id: checkout.lineItems[0].id,
            quantity: 2,
            customAttributes: [
              { key: 'key1', value: 'value1' }
            ],
            variantId: 'gid://shopify/ProductVariant/48535896457238'
          }
        ]).then((checkout) => {
          console.log('Item updated:', checkout)
          setCheckout(checkout)
        })
      }}>
        Update Line Item Quantity + attributes
      </button>
    </div>
  )
}

export default App
