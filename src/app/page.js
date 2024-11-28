'use client';

import * as React from 'react';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    console.log("handling submit");
    setError('');
    setLoading(true);

    event.preventDefault();

    const data = new FormData(event.currentTarget);
    let email = data.get('email');
    let pass = data.get('pass');

    console.log("Sent email:" + email);
    console.log("Sent pass:" + pass);

    runDBCallAsync(`http://localhost:3000/api/login?email=${email}&pass=${pass}`);
  }; // end handle submit

  async function runDBCallAsync(url) {
    try {
      const res = await fetch(url);


      console.log("Response status:", res.status);
      const responseText = await res.text();
      console.log("Response text:", responseText);


      const data = JSON.parse(responseText);
      console.log("Parsed response data:", data);

      setLoading(false);

      if (data.data === "true") {
        console.log("login is valid!");
        if (data.role === "manager") {
          window.location.href = "/manager";
        } else if (data.role === "customer") {
          window.location.href = "/dashboard/page";
        }
      } else if (data.data === "error") {
        setError('Something went wrong. Please try again.');
        console.log("Error message:", data.message);
      } else {
        setError('Invalid email or password');
        console.log("not valid");
      }
    } catch (err) {
      setLoading(false);
      setError('Something went wrong. Please try again.');
      console.error("Catch block error:", err);
    }
  }

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
      </Box>
    </Container>
  ); // end return
}
