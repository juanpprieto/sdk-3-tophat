import './App.css'
import { CartCreate } from './CartCreate'
import { CheckoutCreate } from './CheckoutCreate'
import { useState } from 'react'
import { client } from './sdk'
import { sfapi } from './sfapi'
import { CheckoutDiscounts } from './CheckoutDiscounts'
import { CheckoutGiftCards } from './CheckoutGiftCards'
import { CartDiscounts } from './CartDiscounts'
import { CartGiftCards } from './CartGiftCards'


function App() {
  const [checkout, setCheckout] = useState(null)
  const [cart, setCart] = useState(null)
  const showCreateTests = true
  return (
    <div style={{ textAlign: 'left' }}>
      <h1>Checkout vs Cart</h1>
      <CheckoutUpdate checkout={checkout} setCheckout={setCheckout} />
      <CheckoutCreate checkout={checkout} setCheckout={setCheckout} verbose={showCreateTests} />
      <CheckoutDiscounts checkout={checkout} setCheckout={setCheckout} />
      <CheckoutGiftCards checkout={checkout} setCheckout={setCheckout} />
      <CheckoutShippingAddress checkout={checkout} setCheckout={setCheckout} />

      <CartUpdate cart={cart} setCart={setCart} />
      <CartCreate cart={cart} setCart={setCart} verbose={showCreateTests} />
      <CartDiscounts cart={cart} setCart={setCart} />
      <CartGiftCards cart={cart} setCart={setCart} />
      <CartShippingAddress cart={cart} setCart={setCart} />
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

function CartShippingAddress({ cart, setCart }) {
  return (
    <div>
      <br />
      <br />
      <h1>Cart Shipping Address</h1>
      <button onClick={async () => {
        sfapi.updateShippingAddress(cart?.id, {
          address1: '24 Westwind Street',
          address2: 'Apt C',
          city: 'Marina Del Rey',
          company: 'Fake Company',
          country: 'United States',
          firstName: 'Juan',
          lastName: 'Prieto',
          phone: '424-537-8776',
          province: 'CA',
          zip: '90292'
        }).then((res) => {
          console.log('Shipping address updated:', res)
          const { data: { cartBuyerIdentityUpdate: { cart } } } = res
          setCart(cart)
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
    </div>
  )
}

function CartUpdate({ cart, setCart }) {
  if (!cart) return null
  return (
    <div>
      <br />
      <br />
      <h1>Cart Update</h1>
      <a href={cart.checkoutUrl} target="_blank">Open Cart</a>
      <button onClick={async () => {
        sfapi.addLineItems(cart?.id, [{
          merchandiseId: 'gid://shopify/ProductVariant/48535896555542',
          quantity: 1
        }
        ]).then((res) => {
          console.log('Response:', res)
          const { data: { cartLinesAdd: { cart } } } = res
          console.log('Item added:', cart)
          setCart(cart)
        })
      }}>
        Add another item to cart
      </button>
      <button onClick={async () => {
        sfapi.updateAttributes(cart?.id, {
          attributes: [{
            key: 'key1',
            value: 'value1'
          },
          {
            key: 'key2',
            value: 'value2'
          }]
        }).then((res) => {
          console.log('Response:', res)
          const { data: { cartAttributesUpdate: { cart } } } = res
          console.log('Item added:', cart)
          setCart(cart)
        })
      }}>
        Update attributes
      </button>
      <button onClick={async () => {
        sfapi.updateAttributes(cart?.id, {
          note: 'This is a note'
        }).then((res) => {
          console.log('Response:', res)
          const { data: { cartNoteUpdate: { cart } } } = res
          console.log('Item added:', cart)
          setCart(cart)
        })
      }}>
        Update attributes (note)
      </button>
      <button onClick={async () => {
        sfapi.updateAttributes(cart?.id, {
          attributes: [{
            key: 'key1',
            value: 'value1'
          },
          {
            key: 'key2',
            value: 'value2'
          }],
          note: 'This is a note'
        }).then((res) => {
          console.log('Response:', res)
          const { data } = res
          const cart = data?.cartAttributesUpdate?.cart || data?.cartNoteUpdate?.cart
          console.log('Item added:', cart)
          setCart(cart)
        })
      }}>
        Update attributes & note
      </button>
      <button onClick={async () => {
        sfapi.updateEmail(cart?.id, 'john.doe@shopify.com').then((res) => {
          console.log('Response:', res)
          const { data: { cartBuyerIdentityUpdate: { cart } } } = res
          console.log('Item added:', cart)
          setCart(cart)
        })
      }}>
        Update Email
      </button>
      
      <button onClick={async () => {
        sfapi.addGiftCards(cart?.id, ['100offgiftcard']).then((res) => {
          console.log('Response:', res)
          const { data: { cartGiftCardCodesUpdate: { cart } } } = res
          console.log('Item added:', cart)
          setCart(cart)
        })
      }}>
        Add Gift Card
    </button>

      <button onClick={async () => {
        sfapi.addGiftCards(cart?.id, ['100offgiftcard', '50offgiftcard']).then((res) => {
          console.log('Response:', res)
          const { data: { cartGiftCardCodesUpdate: { cart } } } = res
          console.log('Item added:', cart)
          setCart(cart)
        })
      }}>
        Add Gift Cards (2)
    </button>
    <button onClick={async () => {
      sfapi.replaceLineItems(cart?.id, [{
        merchandiseId: 'gid://shopify/ProductVariant/48535896490006',
        quantity: 1
      }
      ]).then((res) => {
        console.log('Response:', res)
        const { data: { cartLinesAdd: { cart } } } = res
        console.log('Item added:', cart)
        setCart(cart)
      })
    }}>
      Replace Line Items
    </button>
    </div>
  )
}

export default App
