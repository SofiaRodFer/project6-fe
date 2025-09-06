export type AuthRequest = {
  username: string;
  password: string;
}

export type TextContent = {
  id: number;
  identifierTag: string;
  content: string;
  visible: boolean;
  pageId: number;
}

export type ImageContent = {
  id: number;
  identifierTag: string;
  altText: string;
  visible: boolean;
  pageId: number;
  url: string;
}