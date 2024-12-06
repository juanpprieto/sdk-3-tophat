import {client} from './sdk'

export function CheckoutDiscounts({checkout, setCheckout}) {
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
       client.checkout.addDiscount(checkout?.id, 'XGETY50OFF').then((checkout) => {
         console.log('Discount added:', checkout.discountApplications)
         setCheckout(checkout)
       })
     }}>
      Add X Get $50 off on Y discount
    </button>
    <button onClick={async () => {
       client.checkout.addDiscount(checkout?.id, 'XGETYFREEE').then((checkout) => {
         console.log('Discount added:', checkout.discountApplications)
         setCheckout(checkout)
       })
     }}>
      Add X Get Y Free discount
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

    <button onClick={async () => {
        client.checkout.addDiscount(checkout?.id, 'FREESHIPPINGALLCOUNTRIES').then((checkout) => {
          console.log('Discount added:', checkout.discountApplications)
          setCheckout(checkout)
        })
      }}>
      Add Free Shipping discount (all countries)
    </button>

    <button onClick={async () => {
        client.checkout.addDiscount(checkout?.id, 'FREESHIPPINGEXCLUDERATES').then((checkout) => {
          console.log('Discount added:', checkout.discountApplications)
          setCheckout(checkout)
        })
      }}>
      Add Free Shipping discount (exclude rates)
   </button>
   </div>
 )
}

