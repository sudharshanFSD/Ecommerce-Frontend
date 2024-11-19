import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Button, Menu, MenuItem, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { AccountCircle, Menu as MenuIcon } from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

function Navbar({ isAdmin, isLoggedIn, onLogout, userDetails }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerContent = (
    <List>
      {isLoggedIn && (
        <ListItem>
          <AccountCircle />
          <ListItemText primary={userDetails?.username || 'User'} sx={{ marginLeft: 1 }} />
        </ListItem>
      )}
      <ListItem button component={Link} to="/home" onClick={toggleDrawer(false)}>
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button component={Link} to="/collections" onClick={toggleDrawer(false)}>
        <ListItemText primary="Collections" />
      </ListItem>
      <ListItem button component={Link} to="/CartPage" onClick={toggleDrawer(false)}>
        <ListItemText primary="Cart" />
      </ListItem>
      {isLoggedIn ? (
        <>
          {isAdmin && (
            <ListItem button component={Link} to="/admin/packages" onClick={toggleDrawer(false)}>
              <ListItemText primary="Admin" />
            </ListItem>
          )}
          <ListItem button onClick={() => { onLogout(); toggleDrawer(false)(); }} >
            <ListItemText primary="Logout" />
          </ListItem>
        </>
      ) : (
        <>
          <ListItem button component={Link} to="/login" onClick={toggleDrawer(false)}>
            <ListItemText primary="Login" />
          </ListItem>
          <ListItem button component={Link} to="/register" onClick={toggleDrawer(false)}>
            <ListItemText primary="Register" />
          </ListItem>
        </>
      )}
    </List>
  );

  return (
    <AppBar position="static" style={{ backgroundColor: '#333', marginBottom: 50 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/home" style={{ color: 'inherit', textDecoration: 'none' }}>
            WildCart
          </Link>
        </Typography>

        {isMobile ? (
          <>
            <IconButton edge="end" color="inherit" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
              {drawerContent}
            </Drawer>
          </>
        ) : (
          <>
            <Button color="inherit">
              <Link to="/home" style={{ color: 'inherit', textDecoration: 'none' }}>
                Home
              </Link>
            </Button>
            <Button color="inherit" component={Link} to="/CartPage" style={{ color: 'inherit', textDecoration: 'none' }}>
              Cart
            </Button>
            <Button color="inherit">
              <Link to="/collections" style={{ color: 'inherit', textDecoration: 'none' }}>
                Collections
              </Link>
            </Button>

            {isLoggedIn ? (
              <div>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                  color="inherit"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <AccountCircle />
                  <Typography variant="body1" sx={{ marginLeft: 1 }}>
                    {userDetails?.username || 'User'}
                  </Typography>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  keepMounted
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  {isAdmin && (
                    <MenuItem onClick={handleMenuClose}>
                      <Link to="/admin/packages" style={{ color: 'inherit', textDecoration: 'none' }}>
                        Admin
                      </Link>
                    </MenuItem>
                  )}
                  <MenuItem onClick={onLogout}>Logout</MenuItem>
                </Menu>
              </div>
            ) : (
              <>
                <Button color="inherit">
                  <Link to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>
                    Login
                  </Link>
                </Button>
                <Button color="inherit">
                  <Link to="/register" style={{ color: 'inherit', textDecoration: 'none' }}>
                    Register
                  </Link>
                </Button>
              </>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
