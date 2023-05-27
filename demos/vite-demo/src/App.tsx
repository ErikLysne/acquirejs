import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { BrowserRouter, Link } from "react-router-dom";
import MockSwitch from "./components/MockSwitch";
import AcquireMockProvider from "./providers/AcquireMockProvider";
import queryClient from "./react-query/queryClient";
import PageRouter from "./routes/PageRouter";
import theme from "./theme/theme";

function App(): React.ReactElement {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <AcquireMockProvider>
            <CssBaseline />
            <AppBar>
              <Toolbar>
                <Typography
                  fontWeight="bold"
                  component={Link}
                  to="/posts"
                  color="white"
                >
                  Acquire
                </Typography>
                <MockSwitch />
              </Toolbar>
            </AppBar>
            <Toolbar /> {/* Spacer */}
            <PageRouter />
          </AcquireMockProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
