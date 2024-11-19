import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#333', color: '#fff', py: 6 }}>
      <Container maxWidth="100%">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2" color="inherit">
              WildCart is committed to delivering high-quality products that bring joy and convenience to your life. We prioritize customer satisfaction, eco-friendly practices, and a seamless shopping experience.
            </Typography>
          </Grid>

          {/* Main Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Main Links
            </Typography>
            <Link href="/" color="inherit" variant="body2" display="block" underline="hover">
              Home Page
            </Link>
            <Link href="/collections" color="inherit" variant="body2" display="block" underline="hover">
              Collections
            </Link>
            <Link href="/cartPage" color="inherit" variant="body2" display="block" underline="hover">
              Cart
            </Link>
            <Link href="/contact" color="inherit" variant="body2" display="block" underline="hover">
              Contact Us
            </Link>
          </Grid>

          {/* Placeholder Grid Item for Alignment */}
          <Grid item xs={12} sm={6} md={3} />

          {/* Social Media & Contact */}
          <Grid item xs={12} sm={6} md={3} container direction="column" justifyContent="flex-start">
            <Typography variant="h6" gutterBottom>
              Connect with Us
            </Typography>
            <Box>
              <IconButton href="https://facebook.com" color="inherit">
                <FacebookIcon />
              </IconButton>
              <IconButton href="https://twitter.com" color="inherit">
                <TwitterIcon />
              </IconButton>
              <IconButton href="https://instagram.com" color="inherit">
                <InstagramIcon />
              </IconButton>
              <IconButton href="https://linkedin.com" color="inherit">
                <LinkedInIcon />
              </IconButton>
            </Box>
            <Typography variant="body2" sx={{ mt: 1 }}>
              support@wildCart.com
            </Typography>
            <Typography variant="body2">+1 (555) 123-4567</Typography>
          </Grid>
        </Grid>

        {/* Footer Bottom Text */}
        <Box textAlign="center" sx={{ pt: 4, borderTop: '1px solid #555', mt: 4 }}>
          <Typography variant="body2" color="inherit">
            &copy; {new Date().getFullYear()} WildCart. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
