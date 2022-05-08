import { Search } from "@mui/icons-material";
import {
  Box,
  Container,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import debouce from "lodash.debounce";
import { SnackbarProvider } from "notistack";
import CardCustom from "./components/CardCustom";

function App() {
  const URL = `https://www.googleapis.com/books/v1`;

  const [keyword, setKeyword] = useState("");
  const [books, setBooks] = useState([]);
  const wishlistLocal = JSON.parse(localStorage.getItem("wishlist"));

  const handleChange = (e) => {
    setKeyword(e.target.value);
  };

  const debouncedResults = useMemo(() => {
    return debouce(handleChange, 300);
  }, []);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  const renderCard = () => {
    return books.map((book) => {
      return (
        <Grid item xs={12} sm={12} md={4}>
          <CardCustom data={book.volumeInfo} refresh={fetchBooks} />
        </Grid>
      );
    });
  };

  const renderWishlist = () => {
    return wishlistLocal.map((book) => {
      return (
        <Grid item xs={12} sm={12} md={4}>
          <CardCustom data={book} refresh={fetchBooks} />
        </Grid>
      );
    });
  };

  const fetchBooks = useCallback(async () => {
    try {
      const { data } = await axios.get(`${URL}/volumes?q=${keyword}`);
      setBooks(data.items);
    } catch (error) {
      console.log(error);
      setBooks([]);
    }
  }, [URL, keyword]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks, keyword]);

  return (
    <SnackbarProvider
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Box sx={{ padding: "10% 20px" }}>
        <Container>
          <Box sx={{ marginBottom: "10%" }}>
            <TextField
              fullWidth
              id="input-with-icon-textfield"
              placeholder="Search here"
              onChange={debouncedResults}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              variant="standard"
            />
          </Box>
          <Box>
            <Grid container spacing={2}>
              {books ? (
                renderCard()
              ) : (
                <Typography
                  sx={{
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    color: "GrayText",
                  }}
                >
                  books not found
                </Typography>
              )}
            </Grid>
          </Box>
          <Box sx={{marginTop: '12%'}}>
            <Typography variant="h5" sx={{fontWeight: 'bold'}}>Your Wishlist</Typography>
            {wishlistLocal ? (
              renderWishlist()
            ) : (
              <Typography color="GrayText">no wishlist found</Typography>
            )}
          </Box>
        </Container>
      </Box>
    </SnackbarProvider>
  );
}

export default App;
