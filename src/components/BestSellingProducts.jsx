import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Card, CardMedia, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BestSellingProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBestSellingProducts = async () => {
      try {
        const response = await axios.get('https://ecommerce-1-33ey.onrender.com/apiProduct/best-selling');
        setProducts(response.data.slice(0, 4)); // Limit to the top 4 best-selling products
      } catch (error) {
        console.error("Failed to fetch best-selling products:", error);
      }
    };
    fetchBestSellingProducts();
  }, []);

  // Function to handle card click and redirect to product detail page
  const handleCardClick = (productId) => {
    navigate(`/products/${productId}`); // Adjust the path based on your routing setup
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Best Selling Products
      </Typography>
      <Typography variant="body1" textAlign="center" sx={{ marginBottom: 2 }}>
        Discover our most popular items, chosen by customers like you! These best-sellers are highly rated and frequently purchased.
      </Typography>
      <Box sx={{ borderBottom: '2px solid #ccc', marginBottom: 6 }} /> {/* Separator line */}
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product._id}> {/* 4 items per row */}
            <Card 
              onClick={() => handleCardClick(product._id)} // Redirect on card click
              sx={{ 
                position: 'relative', 
                overflow: 'hidden', 
                transition: 'transform 0.3s', 
                '&:hover': { boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }, // Shadow effect on hover
                height: '250px', // Set height for the card
                borderRadius: '0', // Remove rounded corners for sharp edges
                cursor: 'pointer' // Change cursor to pointer
              }}
            >
              <CardMedia
                component="img"
                height="100%" // Set height for the image to occupy the full card height
                image={product.images[0]} // Ensure this points to the actual image URL
                alt={product.title}
                sx={{ 
                  objectFit: 'cover', 
                  transition: 'transform 0.3s', // Smooth transition for the image
                  '&:hover': { transform: 'scale(1.1)' }, // Image grows on hover
                }}
              />
            </Card>
            {/* Product details below the card */}
            <Box sx={{ marginTop: 1, textAlign: 'center' }}>
              <Typography variant="h6">{product.title}</Typography>
              <Typography variant="body2">{product.category}</Typography>
              <Typography variant="subtitle1">${product.price}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BestSellingProducts;
