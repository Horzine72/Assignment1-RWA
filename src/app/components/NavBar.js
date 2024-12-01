'use client';
import React from 'react';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const NavBar = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    MyApp
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button color="inherit" component={Link} href="/dashboard">
                        Dashboard
                    </Button>
                    <Button color="inherit" component={Link} href="/cart">
                        Cart
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
