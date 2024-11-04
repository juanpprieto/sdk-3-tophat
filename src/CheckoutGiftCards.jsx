
import {client} from './sdk'

export function CheckoutGiftCards({checkout, setCheckout}) {
 return (
   <div>
     <br />
     <br />
     <h1>Checkout GiftCards</h1>
     <button onClick={async () => {
        client.checkout.addGiftCards(checkout?.id, '10giftcardtest').then((checkout) => {
          console.log('GiftCard added:', checkout.appliedGiftCards)
          setCheckout(checkout)
        })
      }}>
        Add single gift card
      </button>

     <button onClick={async () => {
       client.checkout.addGiftCards(checkout?.id, ['10giftcardtest', '20giftcardtest']).then((checkout) => {
         console.log('GiftCards added:', checkout.appliedGiftCards)
         setCheckout(checkout)
       })
     }}>
      Add multiple gift cards
    </button>
    <button onClick={async () => {
      client.checkout.removeGiftCard(checkout?.id, checkout.appliedGiftCards[0].id).then((checkout) => {
        console.log('GiftCard removed:', checkout.appliedGiftCards)
        setCheckout(checkout)
      })
    }}>
      Remove single gift card
   </button>
   </div>
 )
}

