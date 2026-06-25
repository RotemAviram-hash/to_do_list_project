import { useReducer } from "react";
import { useEffect } from "react";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";


function albumReducer (state: {albums:any[],isLoading:boolean,error:string | null}, action: { type: string,payload?: any }) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, albums: action.payload || [] };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload || null };
    default:
      return state;
  }
}

//יש לייבא את המידע על האלבומים ולהציגו על המסך
//שימו לב - יש לנהל גם סטייט של שגיאה וגם סטייט של טעינה שיתעדכנו בהתאם למצב

function AlbumsReducerExample() {
  const [{ albums, isLoading, error }, dispatch] = useReducer(albumReducer, {albums: [], isLoading: false, error: null});

  const fetchAlbums = async (): Promise<void> => {
  try {
    dispatch({ type: 'FETCH_START' });
    const response = await fetch("https://jsonplaceholder.typicode.com/albums");
    // בדיקה אם השרת החזיר תגובה תקינה (סטטוס 200-299)
    if (!response.ok) {
      throw new Error("נכשלנו בטעינת האלבומים מהשרת");
    }
    const data: any[] = await response.json();
    dispatch({ type: 'FETCH_SUCCESS', payload: data });
  } catch (err: any) {
    // תפיסת שגיאות ועדכון הסטייט
    dispatch({ type: 'FETCH_ERROR', payload: err.message || "אירעה שגיאה בלתי צפויה" });
  } 
};
useEffect(() => {
  fetchAlbums();
}, []);
// 5. רינדור מותנה על בסיס מצב הסטייט
if (isLoading) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <CircularProgress />
    </Box>
  );
}
if (error) {
  return (
    <Box sx={{ p: 2 }}>
      <Alert severity="error">{error}</Alert>
    </Box>
  );
}
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        רשימת אלבומים
      </Typography>
      {/* 6. רינדור רשימה באמצעות map עם שימוש ב-key ייחודי */}
      <Box component="ul" sx={{ pl: 2 }}>
        {albums.map((album:any) => (
          <Box component="li" key={album.id} sx={{ mb: 1 }}>
            <Typography variant="body1">{album.title}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );

}

export default AlbumsReducerExample;
