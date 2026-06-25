import { useSelector, useDispatch } from "react-redux";

import { Box, Button, Typography, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import {
  increment,
  decrement,
  incrementByAmount,
} from "../../store/counterSlice";
import type { RootState } from "../../store/store";

export default function Counter() {
  // 1. "נרשמים" לסטייט הגלובלי ושולפים רק את הערך של הקאונטר
  const count = useSelector((state: RootState) => state.counter.value);

  // 2. מכינים את השליח (dispatch) שיודע להעביר אקשנים ל-Store
  const dispatch = useDispatch();

  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        הקאונטר הגלובלי שלי
      </Typography>

      {/* תצוגת המספר הנוכחי מתוך רידאקס */}
      <Typography
        variant="h1"
        sx={{ color: "primary.main", fontWeight: "bold" }}
      >
        {count}
      </Typography>

      <Stack direction="row" spacing={2}>
        {/* כפתור פלוס - משלח את האקשן increment */}
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={() => dispatch(increment())}
        >
          הוסף 1
        </Button>

        {/* כפתור מינוס - משלח את האקשן decrement */}
        <Button
          variant="contained"
          color="error"
          startIcon={<RemoveIcon />}
          onClick={() => dispatch(decrement())}
        >
          הפחת 1
        </Button>

        {/* כפתור קפיצה - משלח ערך ספציפי (Payload) של 5 */}
        <Button
          variant="outlined"
          onClick={() => dispatch(incrementByAmount(5))}
        >
          קפוץ ב-5+
        </Button>
      </Stack>
    </Box>
  );
}
