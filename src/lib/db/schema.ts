// src/lib/db/schema.ts
import { 
  pgTable, 
  serial, 
  varchar, 
  integer, 
  decimal, 
  timestamp, 
  boolean, 
  text, 
  date, 
  unique 
} from 'drizzle-orm/pg-core';

export const stocks = pgTable('stocks', {
  id: serial('id').primaryKey(),
  symbol: varchar('symbol', { length: 20 }).notNull().unique(),
  full_symbol: varchar('full_symbol', { length: 30 }).notNull(),
  company_name: varchar('company_name', { length: 255 }).notNull(),
  exchange: varchar('exchange', { length: 10 }).notNull(),
  sector: varchar('sector', { length: 100 }),
  industry: varchar('industry', { length: 100 }),
  market_cap: integer('market_cap'),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const stockPrices = pgTable('stock_prices', {
  id: serial('id').primaryKey(),
  stock_id: integer('stock_id').references(() => stocks.id, { onDelete: 'cascade' }),
  current_price: decimal('current_price', { precision: 15, scale: 4 }).notNull(),
  previous_close: decimal('previous_close', { precision: 15, scale: 4 }).notNull(),
  change_amount: decimal('change_amount', { precision: 15, scale: 4 }).notNull(),
  change_percent: decimal('change_percent', { precision: 8, scale: 4 }).notNull(),
  volume: integer('volume').default(0),
  day_high: decimal('day_high', { precision: 15, scale: 4 }),
  day_low: decimal('day_low', { precision: 15, scale: 4 }),
  market_cap: integer('market_cap'),
  last_updated: timestamp('last_updated').defaultNow(),
}, (table) => ({
  uniqueStockId: unique('unique_stock_id').on(table.stock_id),
}));

export const userPortfolios = pgTable('user_portfolios', {
  id: serial('id').primaryKey(),
  user_id: varchar('user_id', { length: 100 }).notNull(),
  stock_id: integer('stock_id').references(() => stocks.id, { onDelete: 'cascade' }),
  quantity: decimal('quantity', { precision: 15, scale: 4 }).notNull().default('0'),
  average_buy_price: decimal('average_buy_price', { precision: 15, scale: 4 }),
  total_invested: decimal('total_invested', { precision: 15, scale: 4 }),
  buy_date: date('buy_date'),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
}, (table) => ({
  uniqueUserStock: unique('unique_user_stock').on(table.user_id, table.stock_id),
}));

export const userWatchlists = pgTable('user_watchlists', {
  id: serial('id').primaryKey(),
  user_id: varchar('user_id', { length: 100 }).notNull(),
  stock_id: integer('stock_id').references(() => stocks.id, { onDelete: 'cascade' }),
  target_price: decimal('target_price', { precision: 15, scale: 4 }),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow(),
}, (table) => ({
  uniqueUserStock: unique('unique_user_stock').on(table.user_id, table.stock_id),
}));

export const stockNews = pgTable('stock_news', {
  id: serial('id').primaryKey(),
  stock_id: integer('stock_id').references(() => stocks.id, { onDelete: 'cascade' }),
  headline: varchar('headline', { length: 500 }).notNull(),
  summary: text('summary'),
  url: varchar('url', { length: 1000 }),
  source: varchar('source', { length: 100 }),
  published_at: timestamp('published_at'),
  sentiment_score: decimal('sentiment_score', { precision: 3, scale: 2 }),
  relevance_score: decimal('relevance_score', { precision: 3, scale: 2 }),
  created_at: timestamp('created_at').defaultNow(),
  is_general_news: boolean('is_general_news').default(false),
});

export const priceAlerts = pgTable('price_alerts', {
  id: serial('id').primaryKey(),
  user_id: varchar('user_id', { length: 100 }).notNull(),
  stock_id: integer('stock_id').references(() => stocks.id, { onDelete: 'cascade' }),
  alert_type: varchar('alert_type', { length: 20 }).notNull(),
  target_value: decimal('target_value', { precision: 15, scale: 4 }).notNull(),
  is_active: boolean('is_active').default(true),
  triggered_at: timestamp('triggered_at'),
  created_at: timestamp('created_at').defaultNow(),
});