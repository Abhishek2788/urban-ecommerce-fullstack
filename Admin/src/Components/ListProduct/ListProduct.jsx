import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import crossicon from '../../Components/assets/Admin_Assets/cross_icon.png';

const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);
  const fetchInfo = async ()=>{
    await fetch('http://localhost:4000/allproducts')
    .then((res)=>res.json())
    .then((data)=>{setAllProducts(data)});
  }

  useEffect(()=>{
    fetchInfo();
  }, [])

  const remove_product = async (id)=>{
    await fetch('http://localhost:4000/removeproduct', {
      method: 'POST',
      headers: {
        Accept:'application/json',
        'Content-Type':'application/json'
      },
      body:JSON.stringify({id:id})
    })
    await fetchInfo();
  }
  return (
    <div className='list-product'>
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allProducts.map((product,index)=>{
          return(
            <>
              <div key={index} className="listproduct-format-main listproduct-format">
                <img src={product.image} alt={product.name} className='listproduct-product-icon' />
                <p>{product.name}</p>
                <p>${product.old_price}</p>
                <p>${product.new_price}</p>
                <p>{product.category}</p>
                <img onClick={()=>{remove_product(product.id)}} className='listproduct-remove-icon' src={crossicon} alt="cross icon" />
              </div>
              <hr />
            </>
          )
        })}
      </div>
    </div>
  )
}

export default ListProduct





// fetch('/api/data')
//   .then(response => {
//     if (!response.ok) {
//       // Handle non-successful HTTP responses
//       return response.text().then(text => {
//         throw new Error(`Server error: ${response.status} - ${text}`);
//       });
//     }
//     const contentType = response.headers.get('content-type');
//     if (contentType && contentType.includes('application/json')) {
//       return response.json();
//     } else {
//       // Handle cases where content-type is not JSON
//       return response.text().then(text => {
//         throw new Error(`Expected JSON but received: ${contentType || 'unknown'} - ${text}`);
//       });
//     }
//   })
//   .then(data => console.log(data))
//   .catch(error => console.error('Fetch error:', error));