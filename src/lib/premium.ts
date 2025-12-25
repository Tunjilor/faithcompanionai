export type PremiumStatus = {
  isPremium: boolean
  source?: "paypal" | "stripe"
  expiresAt?: string | null
}
