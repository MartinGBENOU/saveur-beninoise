CREATE TABLE "settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"location" text,
	"rating" integer DEFAULT 5 NOT NULL,
	"quote" text NOT NULL,
	"approved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "uploads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mime" text NOT NULL,
	"data" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "testimonials_approved_created_idx" ON "testimonials" USING btree ("approved","created_at");--> statement-breakpoint
INSERT INTO "testimonials" ("name", "location", "rating", "quote", "approved", "created_at")
SELECT * FROM (VALUES
	('Afiavi K.', 'Cotonou, Haie Vive', 5, 'Le meilleur poulet braisé de Cotonou, sans hésiter. Livré encore fumant en moins de 30 minutes. On commande chaque vendredi !', true, now() - interval '1 minute'),
	('Rodrigue A.', 'Calavi', 5, 'L''amiwo me rappelle celui de ma grand-mère. Les portions sont généreuses et la commande WhatsApp est ultra simple.', true, now() - interval '2 minutes'),
	('Mireille D.', 'Cotonou, Fidjrossè', 5, 'Présentation soignée, saveurs authentiques, service impeccable. On sent la qualité dans chaque bouchée. Je recommande à 100 %.', true, now() - interval '3 minutes')
) AS seed("name", "location", "rating", "quote", "approved", "created_at")
WHERE NOT EXISTS (SELECT 1 FROM "testimonials");