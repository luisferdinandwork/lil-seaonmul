CREATE TABLE "gallery_items" (
	"id" text PRIMARY KEY NOT NULL,
	"image" text NOT NULL,
	"alt" text NOT NULL,
	"label" text NOT NULL,
	"shopee_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hero_slides" (
	"id" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"image" text NOT NULL,
	"shopee_url" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shop_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"sub" text NOT NULL,
	"badge" text NOT NULL,
	"badge_variant" text DEFAULT 'trending' NOT NULL,
	"image" text NOT NULL,
	"shopee_url" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
