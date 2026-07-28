import { relations, sql } from "drizzle-orm"
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

import { saleItem } from "./sale"
import { stockMovement } from "./stockMovement"
import { supplier } from "./supplier"

export const product = sqliteTable("product", {
  id: text("id").primaryKey(),
  sku: text("sku").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  costPrice: integer("cost_price", { mode: "number" }).notNull(),
  sellingPrice: integer("selling_price", { mode: "number" }).notNull(),
  stockQuantity: integer("stock_quantity", { mode: "number" }).default(0).notNull(),
  supplierId: text("supplier_id").references(() => supplier.id, {
    onDelete: "set null"
  }),
  lowStockThreshold: integer("low_stock_threshold", { mode: "number" }).default(5).notNull(),
  category: text("category"),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull()
})

export const productRelations = relations(product, ({ one, many }) => ({
  supplier: one(supplier, {
    fields: [product.supplierId],
    references: [supplier.id]
  }),
  saleItems: many(saleItem),
  stockMovements: many(stockMovement)
}))
