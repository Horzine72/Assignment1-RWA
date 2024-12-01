'use client';
import * as React from 'react';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Link from 'next/link';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const data = new FormData(event.currentTarget);
    let email = data.get('email');
    let pass = data.get('pass');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: pass }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.data === "true") {
        if (data.role === "manager") {
          window.location.href = "/manager";
        } else if (data.role === "customer") {
          window.location.href = "/dashboard";
        }
      } else if (data.data === "error") {
        setError('Something went wrong. Please try again.');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setLoading(false);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ height: '100vh' }} >
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="pass"
            label="Password"
            type="password"
            id="pass"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
        <Box textAlign="center">
          <Link href="/register" passHref>
            <Button variant="text">Register</Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
}
