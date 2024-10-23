import {sfapi} from './sfapi'

export function CartDiscounts({cart, setCart}) {
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
    <button onClick={async () => {
       sfapi.updateDiscountCodes(cart?.id, ['FREESHIPPINGALLCOUNTRIES']).then((res) => {
         console.log('Response:', res)
         const {data: {cartDiscountCodesUpdate: { cart } }} = res
         console.log('Discount added:', cart.discountCodes)
         setCart(cart)
       })
     }}>
       Add Free Shipping discount (all countries)
    </button>
    <button onClick={async () => {
       sfapi.updateDiscountCodes(cart?.id, ['FREESHIPPINGEXCLUDERATES']).then((res) => {
         console.log('Response:', res)
         const {data: {cartDiscountCodesUpdate: { cart } }} = res
         console.log('Discount added:', cart.discountCodes)
         setCart(cart)
       })
     }}>
       Add Free Shipping discount (exclude rates)
    </button>
   </div>
 )
}
