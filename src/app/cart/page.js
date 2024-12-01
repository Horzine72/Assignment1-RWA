'use client';
import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

const CartPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [items, setItems] = useState([]);

    useEffect(() => {
        async function fetchCartItems() {
            try {
                const response = await fetch('/api/cart', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch cart items');
                }

                const text = await response.text();
                const data = text ? JSON.parse(text) : {};

                console.log("Fetched cart items:", data.items);

                setItems(data.items || []);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        }

        fetchCartItems();
    }, []);

    return (
        <div>
            <NavBar />
            <Container maxWidth="sm">
                <Box sx={{ height: '100vh' }}>
                    <Typography component="h1" variant="h5" sx={{ mt: 3, mb: 2 }}>
                        Shopping Cart
                    </Typography>
                    {loading && <CircularProgress />}
                    {error && <Alert severity="error">{error}</Alert>}
                    {items.length === 0 && !loading && (
                        <Typography variant="body1" sx={{ mt: 3 }}>
                            Your cart is empty.
                        </Typography>
                    )}
                    <List>
                        {items.map((item, index) => (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={`${item.pname} - Quantity: ${item.quantity} - Total Price: €${(item.price * item.quantity).toFixed(2)}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Container>
        </div>
    );
};

export default CartPage;
