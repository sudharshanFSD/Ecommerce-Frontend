import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  FormControl,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Snackbar,
  Card,
  CardContent,
} from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import VerifiedIcon from '@mui/icons-material/Verified';
import Footer from '../components/Footer';
import BestSellingProducts from '../components/BestSellingProducts';

const StyledContainer = styled('div')({
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '40px',
});

const ProductDetailsWrapper = styled('div')({
  display: 'flex',
  gap: '20px',
  flexWrap: 'wrap',
});

const ThumbnailsWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
});

const ProductImage = styled('img')({
  width: '80%',
  height: 'auto',
  objectFit: 'cover',
  maxHeight: '600px',
  '@media (max-width: 768px)': {
    width: '100%',
  },
});

const ThumbnailImage = styled('img')({
  width: '120px',
  cursor: 'pointer',
  marginRight: '10px',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
  '@media (max-width: 768px)': {
    width: '80px',
  },
});

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState([]);
  const [mainImage, setMainImage] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://ecommerce-1-33ey.onrender.com/apiProduct/products/${productId}`);
        const productData = response.data;

        // Debug: Check the data format in the console
        console.log('Product Data:', productData);

        // Parse stringified arrays for colors and sizes
        productData.colors = JSON.parse(productData.colors[0] || '[]');
        productData.sizes = JSON.parse(productData.sizes[0] || '[]');

        setProduct(productData);
        setMainImage(productData.images?.[0] || 'fallback-image.jpg'); // Fallback image if no images
      } catch (error) {
        console.error('Error fetching product:', error);
        alert('Failed to load product details. Please try again later.');
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!selectedSize || selectedColor.length === 0) {
      alert('Please select both size and color before adding to cart');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://ecommerce-1-33ey.onrender.com/apiCart/cart',
        {
          productId: product._id,
          quantity: 1,
          size: selectedSize,
          color: selectedColor,
          title: product.title,
          price: product.price,
          description: product.description,
          image: product.images?.[0], // Assuming the first image is the main image
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
        navigate('/CartPage');  // Navigate to the CartPage
      }, 2000);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Session expired or not authenticated. Please log in again.');
        navigate('/login');  
    }else {
      console.error('Error adding to cart:', error);
      alert('There was an issue adding the item to the cart. Please try again.');
    }
  }
  };
  

  const handleColorSelectionChange = (color) => {
    setSelectedColor((prev) => {
      if (prev.includes(color)) {
        console.log('Removing color:', color);
        return prev.filter((item) => item !== color);
      } else {
        console.log('Adding color:', color);
        return [...prev, color];
      }
    });
  };

  const handleSizeSelectionChange = (event) => {
    console.log('Selected Size:', event.target.value);
    setSelectedSize(event.target.value);
  };

  if (!product) return <Typography>Loading...</Typography>;

  return (
    <StyledContainer>
      <Snackbar
        open={successMessage}
        autoHideDuration={2000}
        onClose={() => setSuccessMessage(false)}
        message="Product added to cart successfully!"
      />

      <ProductDetailsWrapper>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <ThumbnailsWrapper>
            {product.images?.length ? (
              product.images.map((image, index) => (
                <ThumbnailImage key={index} src={image} onClick={() => setMainImage(image)} />
              ))
            ) : (
              <Typography>No images available</Typography>
            )}
          </ThumbnailsWrapper>
          <ProductImage src={mainImage} alt="Main Product" />
        </div>

        <Card sx={{ maxWidth: 500, boxShadow: 3, flexGrow: 1 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {product.title}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {product.description}
            </Typography>

            {/* Select Color */}
            <Typography variant="body1">Select Color:</Typography>
            {product.colors?.length ? (
              <FormControl sx={{ mt: 1 }}>
                {product.colors.map((color, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={selectedColor.includes(color)}
                        onChange={() => handleColorSelectionChange(color)}
                      />
                    }
                    label={color}
                  />
                ))}
              </FormControl>
            ) : (
              <Typography>No colors available</Typography>
            )}

            {/* Select Size */}
            <Typography variant="body1" sx={{ mt: 2 }}>
              Select Size:
            </Typography>
            {product.sizes?.length ? (
              <FormControl sx={{ mt: 1 }}>
                <RadioGroup value={selectedSize} onChange={handleSizeSelectionChange}>
                  {product.sizes.map((size, index) => (
                    <FormControlLabel
                      key={index}
                      value={size}
                      control={<Radio />}
                      label={size}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            ) : (
              <Typography>No sizes available</Typography>
            )}

            {/* Price and Button */}
            <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
              Price: ${product.price}
            </Typography>
            <div style={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <VerifiedIcon color="primary" sx={{ mr: 1 }} />
              <Typography>100% Original Product</Typography>
            </div>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleAddToCart}
              disabled={!selectedSize || selectedColor.length === 0}
            >
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      </ProductDetailsWrapper>

      <BestSellingProducts />
      <Footer />
    </StyledContainer>
  );
};

export default ProductDetailPage;
