import React from 'react';
import './Sidebar.css';
import {Link} from 'react-router-dom';
import add_product_icon from '../assets/Admin_Assets/Product_Cart.svg';
import productlist_icon from '../assets/Admin_Assets/Product_list_icon.svg';
import Home_icon from '../assets/Admin_Assets/home.png';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <Link to={'/'} style={{textDecoration: 'none', color: 'black'}}>
        <div className="sidebar-item">
            <img src={Home_icon} alt="Home Icon" className='home-icon' />
            <p>Home Page</p>
        </div>
      </Link>
      <Link to={'/addproduct'} style={{textDecoration: 'none', color: 'black'}}>
        <div className="sidebar-item">
            <img src={add_product_icon} alt="Add icon" />
            <p>Add Product</p>
        </div>
      </Link>
      <Link to={'/listproduct'} style={{textDecoration: 'none', color: 'black'}}>
        <div className="sidebar-item">
            <img src={productlist_icon} alt="Product List Icon" />
            <p>Product List</p>
        </div>
      </Link>
    </div>
  )
}

export default Sidebar;
