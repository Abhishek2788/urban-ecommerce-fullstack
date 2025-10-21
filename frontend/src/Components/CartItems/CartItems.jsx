import React, { useContext } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../Assets/Frontend_Assets/cart_cross_icon.png";

const CartItems = () => {
  const { all_product, cartItems, removeFromCart, getTotalAmount } = useContext(ShopContext);
  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {all_product.map((e,i) => {
        if (cartItems[e.id] > 0) {
          return (
            <div key={i}>
              <div className="cartitems-format cartitems-format-main">
                <img src={e.image} alt={e.name} className="cartitem-product-icon" />
                <p>{e.name}</p>
                <p>${e.new_price}</p>
                <button className="cartitems-quantity">{cartItems[e.id]}</button>
                <p>${e.new_price*cartItems[e.id]}</p>
                <img className="cartitems-remove-icon" src={remove_icon} onClick={() => { removeFromCart(e.id)}} alt="remove icon" />
              </div>
              <hr />
            </div>
          );
        }
        return null;
      })}
      <div className="cartitems-down">
        <div className="cartitems-total">
            <h1>Cart Totals</h1>
            <div>
                <div className="cartitems-total-item">
                    <p>Subtotal</p>
                    <p>${getTotalAmount()}</p>
                </div>
                <hr />
                <div className="cartitems-total-item">
                    <p>Shipping Fee</p>
                    <p>Free</p>
                </div>
                <hr />
                <div className="cartitems-total-item">
                    <h3>Total</h3>
                    <h3>${getTotalAmount()}</h3>
                </div>
                <hr />
            </div>
            <button>Proceed To Checkout</button>
        </div>
        <div className="cartitems-promocode">
            <p>If You have a Promocode, Enter it here</p>
            <div className="cartitems-promobox">
                <input type="text" placeholder="Promocode" />
                <button>Submit</button>
            </div>
        </div>
      </div>
    </div>
  );
};
export default CartItems;
