// src/utils/auth.js
const auth = {
  getUserDetails: async () => {
    // Ensure this code runs only on the client side
    if (typeof window === 'undefined') {
      throw new Error('This function can only be run in the browser');
    }
    
    const token = localStorage.getItem('token');
    const response = await fetch('https://ecommerce-1-33ey.onrender.com/apiAuth/user/details', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Could not fetch user details');
    }
    return response.json();
  },
};

export default auth;
