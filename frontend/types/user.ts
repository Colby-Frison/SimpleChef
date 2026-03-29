/** Aligns with FastAPI `User` / `GET /users/me`. */

export type UserDto = {
  id?: number;
  email?: string;
  full_name?: string | null;
  bio?: string | null;
  profile_image_url?: string | null;
  is_screen_always_on?: boolean;
  calorie_goal?: number | null;
  dietary_restrictions?: string[];
};
