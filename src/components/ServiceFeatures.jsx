import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const ServiceFeatures = () => {
  const features = [
    {
      icon: <VerifiedIcon style={{ fontSize: 50, color: '#4caf50' }} />, // Green for trust
      title: "100% Guarantee",
      description: "Our products are backed by a 100% satisfaction guarantee. Shop with confidence knowing we prioritize quality.",
    },
    {
      icon: <LocalShippingIcon style={{ fontSize: 50, color: '#3f51b5' }} />, // Blue for efficiency
      title: "Fast Shipping",
      description: "Enjoy quick and reliable shipping on every order. We make sure your purchase reaches you on time.",
    },
    {
      icon: <SupportAgentIcon style={{ fontSize: 50, color: '#ff9800' }} />, // Orange for customer care
      title: "24/7 Customer Support",
      description: "We’re here to help anytime. Reach out to our dedicated support team 24/7 for any inquiries.",
    },
  ];

  return (
    <Box sx={{ padding: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Why Shop With Us
      </Typography>
      <Box sx={{ borderBottom: '2px solid #ccc', marginBottom: 4, width: '50%', margin: 'auto' }} />
      
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
              {feature.icon}
              <Typography variant="h6" sx={{ marginTop: 2 }}>
                {feature.title}
              </Typography>
              <Typography variant="body2" sx={{ marginTop: 1, color: '#666' }}>
                {feature.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ServiceFeatures;
