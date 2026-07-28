CREATE TABLE `supplier` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`contact_person` text,
	`email` text,
	`phone` text,
	`address` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `product` (
	`id` text PRIMARY KEY NOT NULL,
	`sku` text NOT NULL UNIQUE,
	`name` text NOT NULL,
	`description` text,
	`cost_price` integer NOT NULL,
	`selling_price` integer NOT NULL,
	`stock_quantity` integer DEFAULT 0 NOT NULL,
	`supplier_id` text REFERENCES `supplier`(`id`) ON DELETE SET NULL,
	`low_stock_threshold` integer DEFAULT 5 NOT NULL,
	`category` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sale` (
	`id` text PRIMARY KEY NOT NULL,
	`total_amount` integer NOT NULL,
	`discount_amount` integer DEFAULT 0 NOT NULL,
	`payment_method` text NOT NULL,
	`staff_id` text NOT NULL REFERENCES `user`(`id`),
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `sale_staff_id_idx` ON `sale` (`staff_id`);
--> statement-breakpoint
CREATE TABLE `sale_item` (
	`id` text PRIMARY KEY NOT NULL,
	`sale_id` text NOT NULL REFERENCES `sale`(`id`) ON DELETE CASCADE,
	`product_id` text NOT NULL REFERENCES `product`(`id`),
	`quantity` integer NOT NULL,
	`unit_price` integer NOT NULL,
	`total_price` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `stock_movement` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL REFERENCES `product`(`id`),
	`quantity` integer NOT NULL,
	`type` text NOT NULL,
	`reason` text,
	`staff_id` text NOT NULL REFERENCES `user`(`id`),
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `stock_movement_product_id_idx` ON `stock_movement` (`product_id`);
--> statement-breakpoint
CREATE INDEX `stock_movement_staff_id_idx` ON `stock_movement` (`staff_id`);