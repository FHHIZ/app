export type ContentUpdateReq = {
  id: string;
  slug?: string;
  status?: "published" | "draft";
  title?: string;
  thumbnail?: string;
  content?: string;
};
