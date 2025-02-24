import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import HomePage from "./pages/HomePage";
import RootLayout from "./pages/Root";
import MangaDetails from "./pages/MangaDetails";
import Catalog from "./pages/Catalog";
import Awards from "./pages/Awards";

const theme = createTheme({
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/mangas/:mangaId", element: <MangaDetails /> },
      { path: "/catalog", element: <Catalog /> },
      { path: "/awards/:awardName", element: <Awards /> },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
