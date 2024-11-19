import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Divider,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import BestSellingProducts from '../components/BestSellingProducts';

const CartPage = () => {
  const [cart, setCart] = useState({
    products: [],
    totalPrice: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);
  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to view your cart');
      navigate('/login');
      return;
    }
  
    try {
      const response = await axios.get('https://ecommerce-1-33ey.onrender.com/apiCart/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.data && Array.isArray(response.data.products)) {
        // Make sure product data exists and is valid
        const productsWithZeroQuantity = response.data.products.map((product) => ({
          ...product,
          quantity: 0, // Set initial quantity to 0
          product: product.product || {}, // Default to an empty object if no product data is found
        }));
  
        // Calculate total price when cart is fetched
        const totalPrice = productsWithZeroQuantity.reduce((total, product) => {
          return total + (product.totalPrice || 0);
        }, 0);
  
        setCart({ ...response.data, products: productsWithZeroQuantity, totalPrice });
      } else {
        setError('Invalid cart data received from server');
        setCart({ products: [], totalPrice: 0 });
      }
    } catch (err) {
      setError('Failed to load cart');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  
  // Recalculate total price whenever cart.products changes
  useEffect(() => {
    const totalPrice = cart.products.reduce((total, product) => {
      return total + (product.totalPrice || 0);
    }, 0);
    setCart((prevState) => ({
      ...prevState,
      totalPrice,
    }));
  }, [cart.products]);
  
  // Your return statement stays the same
  

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to checkout');
      navigate('/login');
      return;
    }

    if (!cart || cart.products.length === 0) {
      setError('Your cart is empty');
      return;
    }

    try {
      const response = await axios.post(
        'https://ecommerce-1-33ey.onrender.com/apiStripe/create-checkout-session',
        { cart },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data;
      if (data.url) {
        window.location.href = data.url;
        setCart({ products: [], totalPrice: 0 });
      } else {
        setError('Failed to initiate checkout');
      }
    } catch (err) {
      setError('An error occurred while processing payment');
      console.error('Error creating checkout session:', err);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity, size, color) => {
    if (newQuantity < 1 || isNaN(newQuantity)) return;
  
    const updatedCart = { ...cart };
    
    // Check if products array exists
    if (!updatedCart.products || updatedCart.products.length === 0) {
      console.error("No products in the cart");
      return;
    }
  
    const productIndex = updatedCart.products.findIndex((item) => {
      // Check if item.product is not null or undefined
      if (!item.product) {
        console.error("Product object is null or undefined", item);
        return false;
      }
      
      // Return true only if the product matches the ID, size, and color
      return item.product._id === productId && item.size === size && item.color === color;
    });
  
    // If the product exists, update its quantity and price
    if (productIndex !== -1) {
      const updatedProduct = updatedCart.products[productIndex];
      updatedProduct.quantity = newQuantity;
      updatedProduct.totalPrice = updatedProduct.product.price * newQuantity;
  
      // Recalculate the total price of the cart
      updatedCart.totalPrice = updatedCart.products.reduce((total, product) => {
        return total + (product.totalPrice || 0);
      }, 0);
  
      // Update the cart state
      setCart(updatedCart);
  
      const token = localStorage.getItem('token');
      try {
        await axios.put(
          `https://ecommerce-1-33ey.onrender.com/apiCart/cart/${productId}`,
          { quantity: newQuantity, size, color },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error('Failed to update quantity in the backend', err);
      }
    } else {
      console.error('Product not found in the cart');
    }
  };
  

  const handleRemoveProduct = (productId, size, color) => {
    const updatedCart = { ...cart };
  
    // Make sure that the product exists and the required properties are available
    const productIndex = updatedCart.products.findIndex(
      (item) =>
        item.product &&
        item.product._id === productId &&
        item.size === size &&
        item.color === color
    );
  
    if (productIndex !== -1) {
      updatedCart.products.splice(productIndex, 1);
      updatedCart.totalPrice = updatedCart.products.reduce((total, product) => {
        return total + (product.totalPrice || 0);
      }, 0);
      setCart(updatedCart);
  
      const token = localStorage.getItem('token');
      if (token) {
        axios
          .delete(`https://ecommerce-1-33ey.onrender.com/apiCart/cart/${productId}`, {
            headers: { Authorization: `Bearer ${token}` },
            data: { size, color },
          })
          .catch((err) => {
            console.error('Error removing product:', err);
          });
      }
    } else {
      console.error('Product not found or invalid properties');
    }
  };
  
  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>{error}</Typography>;

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>
      {cart.products.length === 0 ? (
        <Typography>Your cart is empty</Typography>
      ) : (
        <Grid container spacing={4}>
          {cart.products
            .filter(({ product }) => product?._id && product?.images?.[0]) // Filter out products with missing _id or image
            .map(({ product, quantity, size, color }) => (
              <Grid item xs={12} md={6} key={`${product._id}-${size}-${color}`}>
                <Card sx={{ display: 'flex', borderRadius: 2, boxShadow: 3 }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 180, height: 180, objectFit: 'cover', margin: 2 }}
                    image={product?.images?.[0] || 'default-image.jpg'} // Safe fallback for missing images
                    alt={product?.title || 'Product Image'}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, padding: 2 }}>
                    <CardContent>
                      <Typography variant="h6">{product?.title || 'Unknown Product'}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Category: {product?.category || 'N/A'}
                      </Typography>
                      <Typography variant="subtitle1" color="text.primary">
                        Price: ${product?.price || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Size: {size}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Color: {color}
                      </Typography>
                      <TextField
                        type="number"
                        label="Quantity"
                        value={quantity}
                        onChange={(e) =>
                          handleUpdateQuantity(product._id, parseInt(e.target.value), size, color)
                        }
                        fullWidth
                        sx={{ marginTop: 2 }}
                      />
                      <Button
                        color="secondary"
                        sx={{ marginTop: 2 }}
                        startIcon={<DeleteIcon />}
                        onClick={() => handleRemoveProduct(product._id, size, color)}
                      >
                        Remove
                      </Button>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
            ))}
        </Grid>
      )}
      <Box sx={{ marginTop: 3 }}>
        <Typography variant="h6">Total: ${cart.totalPrice}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCheckout}
          sx={{ marginTop: 3, alignSelf: 'flex-start' }}
        >
          Checkout
        </Button>
      </Box>
      <Divider sx={{ marginY: 3 }} />
      <BestSellingProducts />
      <Footer />
    </Box>
  );
};

export default CartPage;
