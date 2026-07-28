import { relations, sql } from "drizzle-orm"
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core"

import { user } from "./auth"
import { product } from "./product"

export const stockMovement = sqliteTable(
  "stock_movement",
  {
    id: text("id").primaryKey(),
    productId: text("product_id")
      .notNull()
      .references(() => product.id),
    quantity: integer("quantity", { mode: "number" }).notNull(),
    type: text("type").notNull(),
    reason: text("reason"),
    staffId: text("staff_id")
      .notNull()
      .references(() => user.id),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull()
  },
  (table) => [
    index("stock_movement_product_id_idx").on(table.productId),
    index("stock_movement_staff_id_idx").on(table.staffId)
  ]
)

export const stockMovementRelations = relations(stockMovement, ({ one }) => ({
  product: one(product, {
    fields: [stockMovement.productId],
    references: [product.id]
  }),
  staff: one(user, {
    fields: [stockMovement.staffId],
    references: [user.id]
  })
}))
