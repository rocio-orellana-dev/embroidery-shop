import { z } from 'zod';
import { insertProductSchema, insertUserSchema, products, cartItems } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  products: {
    list: {
      method: 'GET' as const,
      path: '/api/products',
      input: z.object({
        search: z.string().optional(),
        category: z.string().optional(),
        sort: z.enum(['featured', 'new', 'bestseller', 'price_asc', 'price_desc']).optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<any>()), // Typed as ProductWithFormats[] in practice
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/products/:id',
      responses: {
        200: z.custom<any>(), // Typed as ProductWithFormats
        404: errorSchemas.notFound,
      },
    },
  },
  cart: {
    get: {
      method: 'GET' as const,
      path: '/api/cart',
      responses: {
        200: z.array(z.custom<any>()), // CartItemWithDetails[]
        401: errorSchemas.unauthorized,
      },
    },
    addItem: {
      method: 'POST' as const,
      path: '/api/cart',
      input: z.object({
        productId: z.number(),
        quantity: z.number().default(1),
      }),
      responses: {
        200: z.custom<any>(), // CartItem
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    removeItem: {
      method: 'DELETE' as const,
      path: '/api/cart/:id',
      responses: {
        200: z.void(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  },
  auth: {
    // Standard Passport routes are handled by convention, but defining here for clarity
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: z.object({
        username: z.string(),
        password: z.string(),
      }),
      responses: {
        200: z.custom<any>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout',
      responses: {
        200: z.void(),
      },
    },
    register: {
      method: 'POST' as const,
      path: '/api/register',
      input: insertUserSchema,
      responses: {
        201: z.custom<any>(),
        400: errorSchemas.validation,
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.custom<any>(), // User | null
      },
    }
  }
};

// ============================================
// HELPER
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
