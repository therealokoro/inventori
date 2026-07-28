import { relations, sql } from "drizzle-orm"
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core"

import { user } from "./auth"
import { product } from "./product"

export const sale = sqliteTable(
  "sale",
  {
    id: text("id").primaryKey(),
    totalAmount: integer("total_amount", { mode: "number" }).notNull(),
    discountAmount: integer("discount_amount", { mode: "number" }).default(0).notNull(),
    paymentMethod: text("payment_method").notNull(),
    staffId: text("staff_id")
      .notNull()
      .references(() => user.id),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull()
  },
  (table) => [index("sale_staff_id_idx").on(table.staffId)]
)

export const saleRelations = relations(sale, ({ one, many }) => ({
  staff: one(user, {
    fields: [sale.staffId],
    references: [user.id]
  }),
  items: many(saleItem)
}))

export const saleItem = sqliteTable("sale_item", {
  id: text("id").primaryKey(),
  saleId: text("sale_id")
    .notNull()
    .references(() => sale.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .notNull()
    .references(() => product.id),
  quantity: integer("quantity", { mode: "number" }).notNull(),
  unitPrice: integer("unit_price", { mode: "number" }).notNull(),
  totalPrice: integer("total_price", { mode: "number" }).notNull()
})

export const saleItemRelations = relations(saleItem, ({ one }) => ({
  sale: one(sale, {
    fields: [saleItem.saleId],
    references: [sale.id]
  }),
  product: one(product, {
    fields: [saleItem.productId],
    references: [product.id]
  })
}))
