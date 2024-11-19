import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FormControl,
  Checkbox,
  FormControlLabel,
  Grid,
  Card,
  CardMedia,
  Typography,
  Box,
  TextField
} from '@mui/material';
import axios from 'axios';

const FilterSortComponent = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState('');
  const [searchQuery, setSearchQuery] = useState('');  // New state for search query

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [selectedCategories, sortOrder, products, searchQuery]); // Re-run filter when search query changes

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://ecommerce-1-33ey.onrender.com/apiProduct/products/');
      setProducts(response.data);

      const defaultCategories = ["Men", "Women", "kids"];
      const fetchedCategories = response.data
        .map(product => product.category.toLowerCase())
        .filter((value, index, self) => self.indexOf(value) === index);

      const combinedCategories = [
        ...new Set([...fetchedCategories, ...defaultCategories.map(cat => cat.toLowerCase())])
      ];

      const formattedCategories = combinedCategories.map(cat => {
        if (cat === 'men') return 'Men';
        if (cat === 'women') return 'Women';
        if (cat === 'kids') return 'kids';
        return cat.charAt(0).toUpperCase() + cat.slice(1);
      });

      setCategories(formattedCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const handleCategoryChange = (event) => {
    const category = event.target.name;
    setSelectedCategories(prev => prev.includes(category)
      ? prev.filter(item => item !== category)
      : [...prev, category]
    );
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);  // Update search query state
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => selectedCategories.includes(product.category));
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => sortOrder === 'asc' ? a.price - b.price : b.price - a.price);

    setFilteredProducts(filtered);
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={4} md={3}>
          <Box sx={{ borderRadius: 0, border: '1px solid #ddd', padding: 2 }}>
            <Typography variant="h6" gutterBottom>Filters</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography variant="body1">Category</Typography>
                  {categories.map(category => (
                    <FormControlLabel
                      key={category}
                      control={
                        <Checkbox
                          checked={selectedCategories.includes(category)}
                          onChange={handleCategoryChange}
                          name={category}
                        />
                      }
                      label={category}
                    />
                  ))}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Search"
                  variant="outlined"
                  fullWidth
                  value={searchQuery}
                  onChange={handleSearchChange}
                  sx={{ marginBottom: 2 }}
                />
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ borderRadius: 0, border: '1px solid #ddd', padding: 2, marginTop: 3 }}>
            <Typography variant="h6" gutterBottom>Sort by Price</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <FormControlLabel
                  control={<Checkbox checked={sortOrder === 'asc'} onChange={() => setSortOrder('asc')} />}
                  label="Low to High"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={<Checkbox checked={sortOrder === 'desc'} onChange={() => setSortOrder('desc')} />}
                  label="High to Low"
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={12} sm={8} md={9}>
          <Typography variant="h6" gutterBottom>Collections</Typography>
          <Grid container spacing={4}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
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
                      sx={{ objectFit: 'cover', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.1)' } }}
                    />
                  </Card>
                  <Box sx={{ marginTop: 1, textAlign: 'center' }}>
                    <Typography variant="h6">{product.title}</Typography>
                    <Typography variant="body2">{product.category}</Typography>
                    <Typography variant="subtitle1">${product.price}</Typography>
                  </Box>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="body1" textAlign="center">No products found.</Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FilterSortComponent;
