'use client';
import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default function ManagerPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('/api/manager/orders');
        const data = await response.json();
        setOrders(data.orders);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders');
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ height: '100vh', mt: 4 }}>
        <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
          Manager Dashboard
        </Typography>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography component="h2" variant="h6">Orders</Typography>
          <Table>
            <TableHead>
              <TableRow><TableCell>Order ID</TableCell><TableCell>Customer</TableCell><TableCell>Items</TableCell><TableCell>Total</TableCell><TableCell>Status</TableCell></TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order._id.slice(-6).toUpperCase()}</TableCell>
                  <TableCell>{order.userId.slice(-6).toUpperCase()}</TableCell>
                  <TableCell>{order.items.map(item => item.pname).join(', ')}</TableCell>
                  <TableCell>€
                    {order.items.reduce((total, item) => {
                      const itemTotal = item.price * item.quantity;
                      return total + itemTotal;
                    }, 0).toFixed(2)}
                  </TableCell>
                  <TableCell>{order.status || "Pending"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Container>
  );
}
