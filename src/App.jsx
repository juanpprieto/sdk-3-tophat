import './App.css'
import {CartCreate} from './CartCreate'
import {CheckoutCreate} from './CheckoutCreate'
import {useState} from 'react'
import {client} from './sdk'
import {sfapi} from './sfapi'

function App() {
  const [checkout, setCheckout] = useState(null)
 const [cart, setCart] = useState(null)
  return (
    <div style={{textAlign:'left'}}>
    <h1>Checkout vs Cart creation</h1>
    <CheckoutUpdate checkout={checkout} setCheckout={setCheckout}/>
    <CheckoutCreate checkout={checkout} setCheckout={setCheckout}/>
    <CheckoutDiscounts checkout={checkout} setCheckout={setCheckout}/>
    <CartUpdate cart={cart} setCart={setCart}/>
    <CartCreate cart={cart} setCart={setCart}/>
    <CartDiscounts cart={cart} setCart={setCart}/>
    </div>
  )
}


function CheckoutUpdate({checkout, setCheckout}) {
 return (
    <div>
      <br />
      <br />
      <h1>Checkout Update</h1>
      <a href={checkout?.webUrl} target="_blank">Open Checkout</a>
      <button onClick={async () => {
        client.checkout.addLineItems(checkout?.id, [
          { 
            variantId:'gid://shopify/ProductVariant/48535896555542',
            quantity: 1
          }
        ]).then((checkout) => {
          console.log('Item added:', checkout)
          setCheckout(checkout)
        })
      }}>
        Add another item to checkout
      </button>
   </div>
 )
}

function CartUpdate({cart, setCart}) {
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
          const {data: {cartLinesAdd: { cart } }} = res
          console.log('Item added:', cart)
          setCart(cart)
        })
      }}>
        Add another item to cart
      </button>
    </div>
  )
}

function CheckoutDiscounts({checkout, setCheckout}) {
 return (
   <div>
     <br />
     <br />
     <h1>Checkout Discounts</h1>
     <button onClick={async () => {
       client.checkout.addDiscount(checkout?.id, '10PERCENTOFF').then((checkout) => {
         console.log('Discount added:', checkout.discountApplications)
         setCheckout(checkout)
       })
     }}>
      Add 10% off discount
    </button>
    <button onClick={async () => {
       client.checkout.addDiscount(checkout?.id, '10OFF').then((checkout) => {
         console.log('Discount added:', checkout.discountApplications)
         setCheckout(checkout)
       })
     }}>
      Add $10 off discount
    </button>
    <button onClick={async () => {
       client.checkout.addDiscount(checkout?.id, 'AUTO10PERCENT').then((checkout) => {
         console.log('Discount added:', checkout.discountApplications)
         setCheckout(checkout)
       })
     }}>
     Auto Add 10% off discount
    </button>
    <button onClick={async () => {
       client.checkout.addDiscount(checkout?.id, 'XGETY50PERCENT').then((checkout) => {
         console.log('Discount added:', checkout.discountApplications)
         setCheckout(checkout)
       })
     }}>
      Add X Get Y 50% off discount next product
    </button>
    <button onClick={async () => {
       client.checkout.addDiscount(checkout?.id, 'ORDERFIXED50OFF').then((checkout) => {
         console.log('Discount added:', checkout.discountApplications)
         setCheckout(checkout)
       })
     }}>
      Add $50 off on order discount
    </button>
    <button onClick={async () => {
       client.checkout.addDiscount(checkout?.id, 'ORDER50PERCENTOFF').then((checkout) => {
         console.log('Discount added:', checkout.discountApplications)
         setCheckout(checkout)
       })
     }}>
      Add %50 off on order discount
    </button>
   </div>
 )
}


function CartDiscounts({cart, setCart}) {
 return (
   <div>
     <br />
     <br />
     <h1>Cart Discounts</h1>
     <button onClick={async () => {
       sfapi.updateDiscountCodes(cart?.id, ['10PERCENTOFF']).then((res) => {
         console.log('Response:', res)
         const {data: {cartDiscountCodesUpdate: { cart } }} = res
         console.log('Discount added:', cart.discountCodes)
         setCart(cart)
       })
     }}>
      Add 10% off discount
    </button>
    <button onClick={async () => {
       sfapi.updateDiscountCodes(cart?.id, ['10OFF']).then((res) => {
         console.log('Response:', res)
         const {data: {cartDiscountCodesUpdate: { cart } }} = res
         console.log('Discount added:', cart.discountCodes)
         setCart(cart)
       })
     }}>
      Add $10 off discount
    </button>
     <button onClick={async () => {
       sfapi.updateDiscountCodes(cart?.id, ['AUTO10PERCENT']).then((res) => {
         console.log('Response:', res)
         const {data: {cartDiscountCodesUpdate: { cart } }} = res
         console.log('Discount added:', cart.discountCodes)
         setCart(cart)
       })
     }}>
      Auto Add 10% off discount
    </button>
     <button onClick={async () => {
       sfapi.updateDiscountCodes(cart?.id, ['XGETY50PERCENT']).then((res) => {
         console.log('Response:', res)
         const {data: {cartDiscountCodesUpdate: { cart } }} = res
         console.log('Discount added:', cart.discountCodes)
         setCart(cart)
       })
     }}>
       Add X Get Y 50% off discount next product
    </button>
    <button onClick={async () => {
       sfapi.updateDiscountCodes(cart?.id, ['ORDERFIXED50OFF']).then((res) => {
         console.log('Response:', res)
         const {data: {cartDiscountCodesUpdate: { cart } }} = res
         console.log('Discount added:', cart.discountCodes)
         setCart(cart)
       })
     }}>
       Add $50 off on order discount
    </button>
    <button onClick={async () => {
       sfapi.updateDiscountCodes(cart?.id, ['ORDER50PERCENTOFF']).then((res) => {
         console.log('Response:', res)
         const {data: {cartDiscountCodesUpdate: { cart } }} = res
         console.log('Discount added:', cart.discountCodes)
         setCart(cart)
       })
     }}>
       Add 50% off on order discount
    </button>
   </div>
   // 
 )
}
export default App
