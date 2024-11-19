import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Card, CardMedia, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LatestProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await axios.get('https://ecommerce-1-33ey.onrender.com/apiProduct/Latest');
        setProducts(response.data.slice(0, 8)); // Limit to the latest 8 products
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchLatestProducts();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Latest Collections
      </Typography>
      <Typography variant="body1" textAlign="center" sx={{ marginBottom: 2 }}>
        Discover our newest arrivals! Featuring fresh styles in Top Wear, Bottom Wear, and Winter Wear to enhance your wardrobe.
      </Typography>
      <Box sx={{ borderBottom: '2px solid #ccc', marginBottom: 6 }} />

      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product._id}>
            <Card 
              onClick={() => handleProductClick(product._id)}
              sx={{ 
                position: 'relative', 
                overflow: 'hidden', 
                transition: 'transform 0.3s', 
                '&:hover': { boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }, 
                height: '250px', 
                borderRadius: '0', 
                cursor: 'pointer'
              }}
            >
              <CardMedia
                component="img"
                height="100%"
                image={product.images[0]}
                alt={product.title}
                sx={{ 
                  objectFit: 'cover', 
                  transition: 'transform 0.3s', 
                  '&:hover': { transform: 'scale(1.1)' }
                }}
              />
            </Card>
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

export default LatestProducts;
