export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  thumbnail_url: string | null;
  author_name: string;
  author_avatar: string | null;
  status: "draft" | "published";
  featured: boolean;
  read_time: number | null;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  categories?: Category[];
  tags?: Tag[];
  article_categories?: { category: Category }[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface ArticleTag {
  article_id: string;
  tag_id: string;
  tag?: Tag;
}

export interface Subscriber {
  id: string;
  email: string;
  subscribed: boolean;
  created_at: string;
}

export interface RedirectLink {
  id: string;
  slug: string;
  destination: string;
  label: string | null;
  nofollow: boolean;
  sponsored: boolean;
  click_count: number;
  created_at: string;
  updated_at: string;
}

export interface RedirectClick {
  id: string;
  link_id: string;
  clicked_at: string;
  referrer_path: string | null;
  user_agent: string | null;
  ip_hash: string | null;
}
