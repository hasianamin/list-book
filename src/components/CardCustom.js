import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useSnackbar } from "notistack";

export default function CardCustom({ data, refresh }) {
  const { enqueueSnackbar } = useSnackbar();

  const toggleWishlist = (book) => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist"));
    if (!wishlist) {
      localStorage.setItem("wishlist", JSON.stringify([]));
      wishlist = JSON.parse(localStorage.getItem("wishlist"));
    }
    let checkItem = wishlist?.some((item) => {
      return item.title === book.title;
    });

    if (!checkItem) {
      wishlist.push(book);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      refresh();
      enqueueSnackbar("added to wishlist", { variant: "success" });
    } else {
      const removeItem = wishlist?.findIndex((item) => {
        return item.title === book.title;
      });
      wishlist.splice(removeItem, 1);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      refresh();
      enqueueSnackbar("removed from wishlist", { variant: "error" });
    }
  };

  const checkWishlistItem = (book) => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist"));
    let checkItem = wishlist?.some((item) => {
      return item.title === book.title;
    });
    return checkItem;
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        title={data.title}
        subheader={data.publishedDate}
        action={
          <IconButton
            aria-label="add to favorites"
            onClick={() => toggleWishlist(data)}
          >
            <FavoriteIcon
              sx={{ color: checkWishlistItem(data) ? "red" : "gray" }}
            />
          </IconButton>
        }
      />
      <CardMedia
        component="img"
        height="194"
        image={data.imageLinks.thumbnail}
        alt={data.authors}
      />
      <CardContent>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: "bold" }}
        >
          {data.authors}
        </Typography>
        {data.ratingsCount ? (
          <Rating name="read-only" value={data.ratingsCount} readOnly />
        ) : (
          <Typography variant="body2" color="text.secondary">
            no rating yet
          </Typography>
        )}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
          }}
        >
          {data.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
