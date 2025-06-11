"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bot, Send, User, TrendingUp, TrendingDown, Minus, Sparkles, BarChart3, Brain } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  recommendation?: {
    symbol: string
    action: "BUY" | "SELL" | "HOLD"
    confidence: number
    reason: string
    targetPrice?: string
    currentPrice?: string
  }
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello! I'm your AI investment assistant. I can help you with stock recommendations, market analysis, and investment strategies. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        {
          content: "Based on current market analysis, here's my recommendation for NVIDIA:",
          recommendation: {
            symbol: "NVDA",
            action: "BUY" as const,
            confidence: 87,
            reason:
              "Strong AI market growth, excellent Q3 earnings, and increasing GPU demand from data centers. The company is well-positioned for the AI revolution.",
            targetPrice: "$520",
            currentPrice: "$485",
          },
        },
        {
          content: "Here's my analysis for Apple stock:",
          recommendation: {
            symbol: "AAPL",
            action: "HOLD" as const,
            confidence: 72,
            reason:
              "Stable revenue from services, but iPhone sales showing some weakness. Good dividend yield and strong brand loyalty provide downside protection.",
            targetPrice: "$195",
            currentPrice: "$189",
          },
        },
        {
          content: "Market analysis suggests caution with Tesla:",
          recommendation: {
            symbol: "TSLA",
            action: "SELL" as const,
            confidence: 65,
            reason:
              "Increased competition in EV market, regulatory concerns, and high valuation relative to fundamentals. Consider taking profits.",
            targetPrice: "$180",
            currentPrice: "$240",
          },
        },
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: randomResponse.content,
        timestamp: new Date(),
        recommendation: randomResponse.recommendation,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 2000)
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "BUY":
        return <TrendingUp className="h-4 w-4" />
      case "SELL":
        return <TrendingDown className="h-4 w-4" />
      default:
        return <Minus className="h-4 w-4" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "BUY":
        return "bg-emerald-500 hover:bg-emerald-600 text-white"
      case "SELL":
        return "bg-red-500 hover:bg-red-600 text-white"
      default:
        return "bg-amber-500 hover:bg-amber-600 text-white"
    }
  }

  return (
    <div className="flex flex-col h-[700px]">
      {/* Chat Header */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <div className="flex items-center p-4 border-b">
          <div className="relative">
            <Avatar className="h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-600">
              <AvatarFallback className="bg-transparent">
                <Brain className="h-5 w-5 text-white" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-gray-900">AI Investment Assistant</h3>
            <p className="text-sm text-gray-500 flex items-center">
              <Sparkles className="h-3 w-3 mr-1" />
              Online • Powered by Advanced AI
            </p>
          </div>
        </div>
      </Card>

      {/* Messages */}
      <Card className="flex-1 border-0 shadow-lg bg-white/80 backdrop-blur-sm mt-4 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start space-x-3",
                  message.type === "user" ? "flex-row-reverse space-x-reverse" : "",
                )}
              >
                <Avatar
                  className={cn(
                    "h-8 w-8 shrink-0",
                    message.type === "user"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600",
                  )}
                >
                  <AvatarFallback className="bg-transparent">
                    {message.type === "user" ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </AvatarFallback>
                </Avatar>

                <div className={cn("flex flex-col max-w-[80%]", message.type === "user" ? "items-end" : "items-start")}>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2 shadow-sm",
                      message.type === "user"
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : "bg-gray-100 text-gray-900",
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>

                  {message.recommendation && (
                    <Card className="mt-3 p-4 bg-gradient-to-r from-white to-gray-50 border shadow-md max-w-md">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="h-5 w-5 text-blue-600" />
                          <span className="font-bold text-lg text-gray-900">{message.recommendation.symbol}</span>
                        </div>
                        <Badge
                          className={cn("flex items-center space-x-1", getActionColor(message.recommendation.action))}
                        >
                          {getActionIcon(message.recommendation.action)}
                          <span>{message.recommendation.action}</span>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                        <div>
                          <p className="text-gray-500">Current Price</p>
                          <p className="font-semibold">{message.recommendation.currentPrice}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Target Price</p>
                          <p className="font-semibold text-green-600">{message.recommendation.targetPrice}</p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{message.recommendation.reason}</p>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Confidence</span>
                          <span className="font-medium">{message.recommendation.confidence}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${message.recommendation.confidence}%` }}
                          />
                        </div>
                      </div>
                    </Card>
                  )}

                  <span className="text-xs text-gray-400 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8 bg-gradient-to-r from-blue-500 to-indigo-600">
                  <AvatarFallback className="bg-transparent">
                    <Bot className="h-4 w-4 text-white" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-2xl px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t bg-white/90 backdrop-blur-sm p-4">
            <form onSubmit={handleSubmit} className="flex space-x-3">
              <div className="flex-1 relative">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about stocks, market trends, or investment strategies..."
                  className="min-h-[50px] max-h-[120px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-12"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e)
                    }
                  }}
                />
              </div>
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 h-auto"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
            <p className="text-xs text-gray-500 mt-2 text-center">Press Enter to send • Shift + Enter for new line</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
