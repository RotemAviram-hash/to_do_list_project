import Joi from "joi";
import type { UserRole } from "../models/User";

// 1. הגדרת ה-Types / Interfaces במפורש
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  displayName: string;
  email: string;
  password: string;
  photoURL?: string;
  role?: UserRole;
}

export interface UpdateUserProfileFormData {
  displayName?: string;
  photoURL?: string;
  role?: UserRole;
}

/**
 * 1. סכימה להתחברות (Login)
 */
export const loginSchema = Joi.object<LoginFormData>({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "אימייל הוא שדה חובה",
      "string.email": "כתובת האימייל אינה תקינה",
    }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "סיסמה היא שדה חובה",
    "string.min": "הסיסמה חייבת להכיל לפחות 6 תווים",
  }),
});

/**
 * 2. סכימה להרשמה / יצירת משתמש (Register)
 * מתאימה בדיוק לשדות של UserProfile + סיסמה
 */
export const registerSchema = Joi.object<RegisterFormData>({
  displayName: Joi.string().min(2).max(50).required().messages({
    "string.empty": "שם תצוגה הוא שדה חובה",
    "string.min": "שם תצוגה חייב להכיל לפחות 2 תווים",
    "string.max": "שם תצוגה לא יכול לעבור 50 תווים",
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "אימייל הוא שדה חובה",
      "string.email": "כתובת האימייל אינה תקינה",
    }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "סיסמה היא שדה חובה",
    "string.min": "הסיסמה חייבת להכיל לפחות 6 תווים",
  }),

  photoURL: Joi.string()
    .uri({ allowRelative: false })
    .allow("")
    .optional()
    .messages({
      "string.uri": "קישור לתמונה אינו תקין",
    }),

  role: Joi.string()
    .valid("admin", "member", "viewer")
    .default("member")
    .optional(),
});

/**
 * 3. סכימה לעדכון פרופיל (Update Profile)
 * משמשת לדיאלוג עריכת פרטי משתמש קיים
 */
export const updateUserProfileSchema = Joi.object<UpdateUserProfileFormData>({
  displayName: Joi.string().min(2).max(50).optional().messages({
    "string.min": "שם תצוגה חייב להכיל לפחות 2 תווים",
  }),
  photoURL: Joi.string()
    .uri({ allowRelative: false })
    .allow("")
    .optional()
    .messages({
      "string.uri": "קישור לתמונה אינו תקין",
    }),
  role: Joi.string().valid("admin", "member", "viewer").optional(),
});
