import { useReducer, useState, type FormEvent } from "react";
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Paper,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

// ==========================================
// 1. הגדרת הטיפוסים והחוזים (TypeScript Interfaces)
// ==========================================

interface CartItem {
  id: string;
  name: string;
}

interface CartState {
  items: CartItem[];
}

// הגדרת הפעולות המותרות לשינוי הסטייט של העגלה
type CartAction =
  | { type: "ADD_ITEM"; payload: string } // הוספה: ה-payload הוא שם המוצר
  | { type: "DELETE_ITEM"; payload: string }; // מחיקה: ה-payload הוא ה-ID של המוצר

// ==========================================
// 2. פונקציית ה-Reducer (המוח הלוגי של העגלה)
// ==========================================

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM":
      // יצירת אובייקט פריט חדש בעגלה
      const newItem: CartItem = {
        id: crypto.randomUUID(), // יצירת מזהה ייחודי בלתי ניתן לשכפול
        name: action.payload,
      };

      // חוק הברזל: מחזירים אובייקט סטייט חדש ומערך חדש לחלוטין בזיכרון (...Spread)
      return {
        ...state,
        items: [...state.items, newItem],
      };

    case "DELETE_ITEM":
      // סינון המערך והסרת הפריט מהעגלה - filter מחזירה מערך חדש אוטומטית
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    default:
      return state;
  }
}

// ==========================================
// 3. קומפוננטת העגלה הראשית
// ==========================================

const initialState: CartState = { items: [] };

export default function ShoppingCart() {
  // חיבור ה-useReducer לעגלת הקניות
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // סטייט מקומי נפרד עבור השליטה בשדה ה-Input
  const [inputValue, setInputValue] = useState<string>("");

  // פונקציית הטיפול בשליחת הטופס
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); // מניעת רענון הדפדפן האוטומטי

    // הגנה: בדיקה שהמשתמש לא מנסה להכניס מוצר ריק או רק רווחים
    if (!inputValue.trim()) return;

    // שליחת פקודה לרדיוסר להוסיף פריט לעגלה עם השם שהוקלד
    dispatch({ type: "ADD_ITEM", payload: inputValue.trim() });

    // איפוס שדה הקלט
    setInputValue("");
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 5, p: 2 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        {/* כותרת העגלה עם אייקון מתאים */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            mb: 3,
          }}
        >
          <ShoppingCartIcon color="primary" />
          <Typography variant="h5" component="h1" sx={{ fontWeight: "bold" }}>
            עגלת הקניות שלי
          </Typography>
        </Box>




        {/* טופס הזנת פריט חדש לעגלה */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", gap: 1, mb: 3 }}
        >
          <TextField
            fullWidth
            label="שם המוצר להוספה"
            variant="outlined"
            size="small"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary">
            הוסף
          </Button>
        </Box>
          <Chip
                key={index} // מכיוון שהמערך קבוע לחלוטין ולא משתנה, כאן מותר להשתמש באינדקס
                label={"NAME"}
                clickable // הופך את ה-Chip ללחיץ ויזואלית (אפקט הובר חכם)
                color="secondary"
                variant="filled"

              />



        {/* הצגת רשימת הפריטים שבעגלה */}
        {state.items.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", my: 2 }}
          >
            עגלת הקניות שלך ריקה. הגיע הזמן לבצע קניות!
          </Typography>
        ) : (
          <List>
            {state.items.map((item) => (
              <ListItem
                key={item.id} // חוק הברזל: שימוש ב-ID הייחודי של הפריט כ-key
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    color="error"
                    onClick={() =>
                      dispatch({ type: "DELETE_ITEM", payload: item.id })
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                }
                sx={{
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  "&:last-child": { borderBottom: "none" },
                }}
              >
                <ListItemText primary={item.name} />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}
