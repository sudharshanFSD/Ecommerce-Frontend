import React, { useState, useEffect } from 'react';
import { Box, Card, Button, Typography, Grid, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Divider, IconButton, CircularProgress, FormControlLabel, Checkbox, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

const AdminPackages = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    sizes: [],  
    colors: [],  
    media: [],
  });
  
  const [editProduct, setEditProduct] = useState(null);
  const [file, setFile] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      axios.interceptors.request.use(
        (config) => {
          config.headers.Authorization = `Bearer ${token}`;
          return config;
        },
        (error) => Promise.reject(error)
      );
      fetchProducts();
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://ecommerce-1-33ey.onrender.com/apiProduct/products');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'sizes' || name === 'colors') {
      setNewProduct({
        ...newProduct,
        [name]: value.split(',').map(item => item.trim()),  // Ensure it's an array
      });
    } else {
      setNewProduct({
        ...newProduct,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files);
  };

  const handleDialogOpen = (product = null) => {
    if (product) {
      setNewProduct({
        ...product,
        sizes: product.sizes ? product.sizes.join(', ') : '',  // Join array to string for display
        colors: product.colors ? product.colors.join(', ') : '',  // Join array to string for display
      });
      setEditProduct(product);
      setIsAddingProduct(false);
    } else {
      setNewProduct({
        title: '',
        description: '',
        category: '',
        price: '',
        stock: '',
        sizes: [],
        colors: [],
        media: [],
      });
      setEditProduct(null);
      setIsAddingProduct(true);
    }
    setDialogOpen(true);
  };
  

  const handleDialogClose = () => {
    setDialogOpen(false);
    setNewProduct({
      title: '',
      description: '',
      category: '',
      price: '',
      stock: '',
      sizes: [],
      colors: [],
      media: [],
    });
    setEditProduct(null);
    setIsAddingProduct(false);
  };

  const handleConfirmDialogOpen = (product) => {
    setProductToDelete(product);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
    setProductToDelete(null);
  };
  const handleAddProduct = async (product) => {
    const formData = new FormData();
  
    // Append other product fields
    for (let key in product) {
      if (key === 'sizes' || key === 'colors') {
        formData.append(key, JSON.stringify(product[key])); // Store as JSON
      } else if (product[key]) {
        formData.append(key, product[key]);
      }
    }
  
    // Append files (if any)
    if (file) {
      Array.from(file).forEach((f) => {
        formData.append('media', f);
      });
    }
  
    try {
      if (editProduct) {
        // Update product if editing an existing product
        await axios.put(`https://ecommerce-1-33ey.onrender.com/apiProduct/products/${editProduct._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        // Add new product
        await axios.post('https://ecommerce-1-33ey.onrender.com/apiProduct/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      fetchProducts();
      handleDialogClose();
    } catch (error) {
      console.error('Error saving product', error);
    }
  };
  
  

  const handleSaveProduct = () => {
    // Ensure that sizes and colors are always converted to arrays, even if entered as a comma-separated string
    const updatedProduct = {
      ...newProduct,
      sizes: typeof newProduct.sizes === 'string' 
        ? newProduct.sizes.split(',').map((item) => item.trim()) 
        : newProduct.sizes,
      colors: typeof newProduct.colors === 'string' 
        ? newProduct.colors.split(',').map((item) => item.trim()) 
        : newProduct.colors,
    };
  
    // Save the product (whether editing or adding)
    handleAddProduct(updatedProduct);
    handleDialogClose();
  };
  
  

  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`https://ecommerce-1-33ey.onrender.com/apiProduct/products/${productToDelete._id}`);
      fetchProducts();
      handleConfirmDialogClose();
    } catch (error) {
      console.error('Error deleting product', error);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box display="flex" justifyContent="center" p={3}>
      <Card sx={{ maxWidth: 1200, padding: '30px', width: '100%' }}>
        <Typography variant="h4" gutterBottom align="center">
          Admin Packages
        </Typography>
        <Divider sx={{ marginBottom: '20px' }} />

        <Button variant="contained" color="primary" onClick={() => handleDialogOpen()} sx={{ marginBottom: '20px' }}>
          Add Product
        </Button>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Product List
            </Typography>
            {products && products.length > 0 ? (
              products.map((product) => (
                <Card key={product._id} sx={{ marginBottom: '20px', padding: '20px', width: '100%', backgroundColor: '#f9f9f9' }}>
                  <Typography variant="h6">{product.title}</Typography>
                  <Typography variant="body1" color="textSecondary">
                    {product.description}
                  </Typography>
                  {product.media && product.media.length > 0 && (
                    <Box mt={2} display="flex" flexWrap="wrap">
                      {product.media.map((image, index) => (
                        <img key={index} src={image.url} alt="product" width={100} height={100} style={{ margin: '5px' }} />
                      ))}
                    </Box>
                  )}
                  <Button variant="contained" color="secondary" onClick={() => handleDialogOpen(product)} sx={{ marginRight: '10px' }}>
                    Edit
                  </Button>
                  <Button variant="contained" color="error" onClick={() => handleConfirmDialogOpen(product)}>
                    Delete
                  </Button>
                </Card>
              ))
            ) : (
              <Typography variant="body1" color="textSecondary">
                No products available.
              </Typography>
            )}
          </Grid>
        </Grid>

        {/* Add/Edit Product Dialog */}
        <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editProduct ? 'Edit Product' : 'Add Product'}
            <IconButton
              aria-label="close"
              onClick={handleDialogClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              name="title"
              value={newProduct.title}
              onChange={handleChange}
              fullWidth
              sx={{ marginBottom: '20px' }}
            />
            <TextField
              label="Description"
              name="description"
              value={newProduct.description}
              onChange={handleChange}
              fullWidth
              sx={{ marginBottom: '20px' }}
            />
            <TextField
              label="Category"
              name="category"
              value={newProduct.category}
              onChange={handleChange}
              fullWidth
              sx={{ marginBottom: '20px' }}
            />
            <TextField
              label="Price"
              name="price"
              value={newProduct.price}
              onChange={handleChange}
              fullWidth
              sx={{ marginBottom: '20px' }}
            />
            <TextField
              label="Stock"
              name="stock"
              value={newProduct.stock}
              onChange={handleChange}
              fullWidth
              sx={{ marginBottom: '20px' }}
            />

            {/* Sizes input */}
            <TextField
              label="Sizes (comma separated)"
              name="sizes"
              value={newProduct.sizes}
              onChange={handleChange}
              fullWidth
              sx={{ marginBottom: '20px' }}
            />
            {/* Colors input */}
            <TextField
              label="Colors (comma separated)"
              name="colors"
              value={newProduct.colors}
              onChange={handleChange}
              fullWidth
              sx={{ marginBottom: '20px' }}
            />
            <input type="file" multiple onChange={handleFileChange} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleSaveProduct}>
              {isAddingProduct ? 'Add Product' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Confirm Delete Dialog */}
        <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this product?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirmDialogClose}>Cancel</Button>
            <Button onClick={handleDeleteProduct} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </Box>
  );
};

export default AdminPackages;
