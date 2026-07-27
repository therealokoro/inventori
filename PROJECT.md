# Inventori — Project Overview

This document explains what this app is, who it's for, and why it's built
the way it is. Any AI agent working on this codebase should read this before
starting a task, alongside `AGENTS.md` for the technical conventions.

## What This App Is

Inventori is an inventory and sales management app for a single small shop.
It replaces a paper ledger or spreadsheet with something that tracks stock
in real time, records sales as they happen, and gives the shop owner
visibility into what's selling, what's running low, and what the business
is worth.

It is built for one physical store. Support for multiple staff accounts and
multiple store locations is a plausible future direction, but the MVP is
scoped to one shop with one staff member working alongside the owner.

## Who Uses It

**Admin (the boss).** Owns the shop, or manages it on the owner's behalf.
Needs full visibility and control: adding and pricing products, seeing
sales and profit reports, managing staff accounts, closing out the day,
handling suppliers. Cares about accuracy and about staff not being able to
alter pricing or delete records they shouldn't.

**Staff.** Works the counter day to day. Needs to record sales quickly,
check stock levels, log incoming deliveries, and flag problems (damaged
goods, discrepancies) — without needing to understand or touch pricing,
reporting, or account management. The app should get out of their way
during a sale, not slow them down.

These two roles have different needs, not just different permissions — the
UI itself should feel different for each: staff gets a fast, focused
sales-and-stock interface; admin gets a fuller dashboard with reporting and
management tools.

## Why Offline Matters

This is the single most important constraint on the app's design, so it's
worth explaining rather than just stating.

Small shops don't always have reliable internet. If the connection drops
mid-afternoon, the shop still needs to be able to sell things — a sale
that can't be recorded because the wifi is down is a sale that gets written
on a scrap of paper and forgotten, which is exactly the problem this app
exists to solve. So: recording a sale, checking current stock, and logging
a delivery must all work with zero connectivity, using data cached on the
device. Once connectivity returns, that data syncs to the cloud backend
automatically, without the staff member needing to do anything.

Not everything needs this guarantee. Admin tasks like generating a profit
report or managing staff accounts can reasonably assume the shop's computer
or the owner's device has a connection when those tasks happen — they're
not time-critical in the same way a sale is. This is why the app's data
layer is deliberately split into "must work offline" and "can assume
connectivity" — see `AGENTS.md` for how that maps to specific tools.

## Core Data

- **Products**: what the shop sells — name, SKU, category, cost price,
  selling price, current quantity, a low-stock threshold, and which
  supplier it comes from.
- **Sales**: a record of each transaction — who rang it up, when, the
  total, and the individual items sold with their quantities and the price
  at the time of sale (prices can change later; a past sale shouldn't).
- **Stock movements**: an audit trail of every quantity change and why it
  happened — a sale, a restock, a manual adjustment, or marking something
  damaged/lost. This is what lets the admin trust the numbers.
- **Suppliers**: who the shop buys from, for restocking and reference.
- **Users**: admin and staff accounts.

## Why Some Fields Are Role-Restricted

Cost price and selling price are visible and relevant to staff (they need
to know what something sells for to ring it up) but shouldn't be _editable_
by staff. The reasoning is straightforward: pricing mistakes or
manipulation directly affect the shop's money, and the owner needs to trust
that a price on the shelf matches a price staff can't quietly change.
Meanwhile, stock quantity has to be editable by staff, constantly, because
that's the whole point of them using the app during a sale — so the
restriction has to be specific to certain fields on a record, not a
blanket lock on the record or the endpoint.

## MVP Scope

**In scope:**

- Product management (add, edit, track stock, low-stock alerts)
- Recording sales and viewing sales history
- Stock movement tracking (restocks, adjustments, damage)
- Two-role auth with the permission model described above
- Admin reporting (sales totals, profit, stock valuation)
- Supplier records
- Offline operation for the sales/stock flow, with sync once reconnected
- Installable as a PWA; usable on desktop via a browser

**Explicitly out of scope for now, revisit later:**

- Barcode scanning (nice-to-have, not required)
- A native desktop wrapper (Tauri) — the web/PWA version comes first
- Multiple store locations
- Customer accounts, credit/debt tracking
- A finalized sync/conflict-resolution strategy — the MVP uses a simple
  default and this gets revisited once real usage patterns are known
- Multi-currency, multi-language

## How to Use This Document

Feature work on this app happens incrementally, one feature area at a time
(foundation/auth first, then inventory, then sales, then admin operations,
then suppliers, then the offline/PWA shell, roughly in that order — later
features depend on earlier ones existing). If a task description doesn't
mention something covered here, this document is the fallback for "why does
this app work this way" — prefer consistency with what's written here over
introducing a new interpretation of the app's purpose.
