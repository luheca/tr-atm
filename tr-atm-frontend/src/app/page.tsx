"use client";

import React, { useState } from 'react';
import { Box } from '@mui/material';
import ATM from './components/ATM'

export default function Home() {
  const [token, setToken] = useState();

  return (
    <Box width="100%" justifyContent="center" display="flex">
      <ATM />
    </Box>
  );
}
