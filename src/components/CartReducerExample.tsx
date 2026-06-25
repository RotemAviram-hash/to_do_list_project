import { useReducer } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";

interface Product {
id: string
name: string
price:number
}
function cartReducer(state: Product[], action: any) {
  switch (action.type) {
    case "ADD_ITEM":
      return [...state, action.payload];

    case "REMOVE_ITEM":
      return state.filter(
        (item) => item.id !== action.payload
      );

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
}
const products = [
  {
    name: "Milk",
    price: 10,
  },
  {
    name: "Bread",
    price: 8,
  },
  {
    name: "Cheese",
    price: 15,
  },
  {
    name: "Eggs",
    price: 12,
  },
];



function CartReducerExample() {

    const [cart, dispatch] = useReducer(
  cartReducer,
  []
);
const addItem = (
  name: string,
  price: number
) => {
  dispatch({
    type: "ADD_ITEM",
    payload: {
      id: crypto.randomUUID(),
      name,
      price,
    },
  });
};
const clearCart = () => {
  dispatch({
    type: "CLEAR_CART",
  });
};
const totalPrice = cart.reduce(
  (sum, item) => sum + item.price,
  0
);
  return (
  <Container maxWidth="md" sx={{ mt: 4 }}>
    <Typography
      variant="h4"
      gutterBottom
    >
      Shopping Cart
    </Typography>

    <Typography variant="h6">
      מוצרים בעגלה: {cart.length}
    </Typography>

    <Typography
      variant="h6"
      gutterBottom
    >
      סה״כ: ₪{totalPrice}
    </Typography>

    <Box
      sx={{
        display: "flex",
        gap: 2,
        mb: 3,
      }}
    >
    <Box
  sx={{
    display: "flex",
    gap: 2,
    flexWrap: "wrap",
    mb: 2,
  }}
>
  {products.map((product) => (
    <Button
      key={product.name}
      variant="contained"
      onClick={() =>
        addItem(
          product.name,
          product.price
        )
      }
    >
      הוסף {product.name}
    </Button>
  ))}
</Box>
      <Button
        variant="outlined"
        color="error"
        onClick={clearCart}
      >
        רוקן עגלה
      </Button>
    </Box>

    {cart.map((item) => (
      <Card
        key={item.id}
        sx={{ mb: 2 }}
      >
        <CardContent>
          <Typography variant="h6">
            {item.name}
          </Typography>

          <Typography>
            ₪{item.price}
          </Typography>

          <Button
            color="error"
            onClick={() =>
              dispatch({
                type: "REMOVE_ITEM",
                payload: item.id,
              })
            }
          >
            הסר
          </Button>
        </CardContent>
      </Card>
    ))}
  </Container>
);
}

export default CartReducerExample;
