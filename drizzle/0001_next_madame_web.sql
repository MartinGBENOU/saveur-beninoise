CREATE TABLE "dishes" (
	"slug" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"price" integer NOT NULL,
	"image" text NOT NULL,
	"tag" text,
	"available" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "dishes_sort_order_idx" ON "dishes" USING btree ("sort_order");--> statement-breakpoint
INSERT INTO "dishes" ("slug", "name", "description", "price", "image", "tag", "available", "sort_order") VALUES
	('poulet-braise', 'Poulet Braisé', 'Poulet bicyclette mariné 12h, grillé au feu de bois, oignons et piment frais.', 3500, '/images/poulet-braise.webp', 'N°1 des ventes', true, 0),
	('amiwo-au-poulet', 'Amiwo au Poulet', 'Pâte rouge de maïs parfumée à la tomate, poulet frit et sauce pimentée maison.', 3000, '/images/amiwo.webp', NULL, true, 1),
	('alloco-et-poisson', 'Alloco & Poisson', 'Bananes plantains dorées, poisson grillé et notre sauce piment secrète.', 2500, '/images/alloco.webp', 'Coup de cœur', true, 2),
	('pate-sauce-arachide', 'Pâte & Sauce Arachide', 'Pâte blanche onctueuse, sauce arachide mijotée au bœuf tendre.', 2500, '/images/sauce-arachide.webp', NULL, true, 3),
	('brochettes-de-boeuf', 'Brochettes de Bœuf', 'Bœuf épicé au kankankan, grillé à la braise, servi avec oignons crus.', 2000, '/images/brochettes.webp', NULL, true, 4),
	('poisson-braise', 'Poisson Braisé', 'Tilapia entier braisé, tomates fraîches, oignons et attiéké.', 4500, '/images/poisson-braise.webp', 'Premium', true, 5)
ON CONFLICT ("slug") DO NOTHING;