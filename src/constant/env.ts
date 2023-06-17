export const isProd = process.env.NODE_ENV === 'production';
export const isLocal = process.env.NODE_ENV === 'development';
export const showLogger = isLocal
  ? true
  : process.env.NEXT_PUBLIC_SHOW_LOGGER === 'true' ?? false;
export const PORT = process.env.PORT;
export const SECRET = process.env.SECRET;
export const MONGODB_URI =
  process.env.MONGODB_URI ?? 'mongodb://localhost:27017/';
