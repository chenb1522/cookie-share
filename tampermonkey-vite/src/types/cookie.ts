// Cookie type definition
export interface Cookie {
  name: string;
  value: string;
  domain: string;
  path: string;
  secure: boolean;
  sameSite?: "Strict" | "Lax" | "None";
  hostOnly?: boolean;
  httpOnly?: boolean;
  session?: boolean;
  expirationDate?: number;
}

// Cookie data structure for storage
export interface CookieData {
  id: string;
  url: string;
  cookies: Cookie[];
}

// Combined cookie item for list display
export interface CookieItem {
  id: string;
  source: "local" | "cloud";
  url?: string;
  cookies?: Cookie[];
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface CookiesResponse extends ApiResponse {
  cookies: Cookie[];
}

export interface CookieListResponse extends ApiResponse {
  cookies: CookieItem[];
}
