
// services/api.ts
// This file will contain all your API integration functions

export class APIService {
  private static baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  // Stock Price Service (yFinance integration)
  static async getStockPrice(symbol: string) {
    try {
      const response = await fetch(`${this.baseURL}/api/stocks/${symbol}/price`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching stock price:', error)
      throw error
    }
  }

  static async getMultipleStockPrices(symbols: string[]) {
    try {
      const response = await fetch(`${this.baseURL}/api/stocks/prices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbols })
      })
      return await response.json()
    } catch (error) {
      console.error('Error fetching multiple stock prices:', error)
      throw error
    }
  }

  // News Service (NewsAPI integration)
  static async getStockNews(symbol?: string, query?: string) {
    try {
      const params = new URLSearchParams()
      if (symbol) params.append('symbol', symbol)
      if (query) params.append('q', query)
      
      const response = await fetch(`${this.baseURL}/api/news?${params}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching news:', error)
      throw error
    }
  }

  // LLM Service (Gemini integration)
  static async getRecommendation(query: string, portfolioContext?: any) {
    try {
      const response = await fetch(`${this.baseURL}/api/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, portfolioContext })
      })
      return await response.json()
    } catch (error) {
      console.error('Error getting recommendation:', error)
      throw error
    }
  }

  // Portfolio Management
  static async uploadPortfolio(file: File) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch(`${this.baseURL}/api/portfolio/upload`, {
        method: 'POST',
        body: formData
      })
      return await response.json()
    } catch (error) {
      console.error('Error uploading portfolio:', error)
      throw error
    }
  }

  static async getPortfolio() {
    try {
      const response = await fetch(`${this.baseURL}/api/portfolio`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching portfolio:', error)
      throw error
    }
  }

  static async updatePortfolioItem(id: string, data: any) {
    try {
      const response = await fetch(`${this.baseURL}/api/portfolio/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      return await response.json()
    } catch (error) {
      console.error('Error updating portfolio item:', error)
      throw error
    }
  }

  static async deletePortfolioItem(id: string) {
    try {
      const response = await fetch(`${this.baseURL}/api/portfolio/${id}`, {
        method: 'DELETE'
      })
      return await response.json()
    } catch (error) {
      console.error('Error deleting portfolio item:', error)
      throw error
    }
  }
}