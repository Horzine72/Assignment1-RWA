'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { green, purple } from '@mui/material/colors';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import NavBar from '../components/NavBar';

// SIMPLE FIX DONT FORGET TO FIX
const username = 'sample@test.com';

const theme = createTheme({
  palette: {
    secondary: {
      main: green[500],
    },
  },
});

export default function Page() {
  const [data, setData] = useState(null);
  const [weather, setWeatherData] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch products or other initial data
    fetch('http://localhost:3000/api/getProducts')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch products');
        setLoading(false);
      });

    // Fetch weather data
    fetch('http://localhost:3000/api/getWeather')
      .then((res) => res.json())
      .then((weather) => {
        setWeatherData(weather);
      })
      .catch((err) => {
        setError('Failed to fetch weather data');
      });
  }, []);

  const addToCart = async (productName) => {
    try {
      const response = await fetch('/api/putInCart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pname: productName, quantity: 1, username }),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add item to cart');
      }

      console.log('Item added to cart:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      <Container component="main" maxWidth="lg">
        <Typography component="h1" variant="h4" sx={{ mb: 2, mt: 4 }}>
          Dashboard
        </Typography>
        <Paper elevation={3} sx={{ padding: 3, mb: 4 }}>
          <Typography component="h2" variant="h6">
            Products
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{item.pname}</TableCell>
                  <TableCell>€{item.price}</TableCell>
                  <TableCell>
                    <Button variant="outlined" onClick={() => addToCart(item.pname)}>
                      Add to cart
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography component="h2" variant="h6">
            Weather
          </Typography>
          <Typography>
            Today's temperature: {JSON.stringify(weather.temp)}
          </Typography>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
