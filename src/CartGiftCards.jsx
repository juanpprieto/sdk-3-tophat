import {sfapi} from './sfapi'

export function CartGiftCards({cart, setCart}) {
 return (
   <div>
     <br />
     <br />
     <h1>Cart GiftCards</h1>
     <button onClick={async () => {
       sfapi.addGiftCards(cart.id, ['10giftcardtest']).then(res => {
         console.log('Response:', res)
         const {data: {cartGiftCardCodesUpdate: { cart } }} = res
         console.log('Giftcard added:', cart.appliedGiftCards)
         setCart(cart)
       })
     }}>
      Add single giftcard
    </button>
    <button onClick={async () => {
       sfapi.addGiftCards(cart.id, ['10giftcardtest', '20giftcardtest']).then(res => {
         console.log('Response:', res)
         const {data: {cartGiftCardCodesUpdate: { cart } }} = res
         console.log('Giftcard added:', cart.appliedGiftCards)
         setCart(cart)
       })
     }}>
      Add multiple giftcards
    </button>
    <button onClick={async () => {
        sfapi.removeGiftCard(cart.id, cart.appliedGiftCards[0].id, cart.appliedGiftCards).then(res => {
          console.log('Response:', res)
          const {data: {cartGiftCardCodesUpdate: { cart } }} = res
          console.log('Giftcard removed:', cart.appliedGiftCards)
          setCart(cart)
        })
      }}
    >
      Remove single giftcard
    </button>
  </div>
  )
}

