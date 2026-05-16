export const AUTH_HEADER_KEY: string = "Authorization";
export const AUTH_TYPE: string = "Bearer";
export const USER_KEY: string = "user";
export const X_RECORD_COUNT_KEY: string = "X-Record-Count";
export const X_PAGE_COUNT_KEY: string = "X-Page-Count";
export const M2M_TOKEN_TYPE: string = "client-credentials";

export enum ContentPermission {
  read = "read:content",
  write = "write:content",
  publish = "publish:content",
}

export enum ImagePermission {
  upload = "upload:image",
}
