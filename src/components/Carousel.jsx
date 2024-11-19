import React from "react";
import Carousel from "react-material-ui-carousel";
import { Box, Paper } from "@mui/material";
import monkSuit from "../assets/monkSuit.jpg";
import gang_three from "../assets/gang_three.jpg";
import sandleSuit from "../assets/sandleSuit.jpg";
import WideRack from '../assets/WideRack.jpg';

const carouselItems = [
  {
    imgUrl: monkSuit
  },
  {
    imgUrl: gang_three
  },
  {
    imgUrl: sandleSuit
  },
  {
    imgUrl: WideRack
  }
];

function CustomCarousel() {
  return (
    <Carousel
      autoPlay
      interval={4000}
      animation="fade"
      indicators={false} // Hide indicators
      navButtonsAlwaysInvisible={true} // Hide navigation arrows
    >
      {carouselItems.map((item, index) => (
        <Paper key={index} elevation={3} sx={{ position: 'relative' }}>
          <Box
            component="img"
            src={item.imgUrl}
            alt={`Carousel item ${index}`} // Use a descriptive alt attribute for accessibility
            sx={{
              width: '100%',
              height: 500,
              objectFit: 'cover',
              objectPosition: '20% 35%', // Adjust to reveal more top portion if needed
            }}
          />
        </Paper>
      ))}
    </Carousel>
  );
}

export default CustomCarousel;
