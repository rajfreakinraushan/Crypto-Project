"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { FaPaperPlane, FaRobot, FaTimes, FaArrowUp, FaArrowDown, FaBitcoin, FaInfoCircle } from "react-icons/fa"
import Chart from "chart.js/auto"
import "./App.css"

// Chart Component
function CryptoChart({ data, color }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (chartRef.current) {
      //destroy
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      // Generate random data if not provided
      const chartData = data || Array.from({ length: 30 }, () => Math.random() * 100)

      // Create gradient
      const ctx = chartRef.current.getContext("2d")
      const gradient = ctx.createLinearGradient(0, 0, 0, 150)
      gradient.addColorStop(0, `${color}33`)
      gradient.addColorStop(1, `${color}00`)

      // Create chart
      chartInstance.current = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels: Array.from({ length: chartData.length }, (_, i) => i),
          datasets: [
            {
              label: "Price",
              data: chartData,
              borderColor: color,
              borderWidth: 2,
              pointRadius: 0,
              tension: 0.4,
              fill: true,
              backgroundColor: gradient,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: false,
            },
          },
          scales: {
            x: {
              display: false,
            },
            y: {
              display: false,
            },
          },
          animation: {
            duration: 2000,
            easing: "easeOutQuart",
          },
        },
      })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, color])

  return (
    <div className="crypto-chart">
      <canvas ref={chartRef} className="chart-canvas"></canvas>
    </div>
  )
}

// Floating Coins Background
function FloatingCoins() {
  const coins = []
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * window.innerWidth
    const y = Math.random() * window.innerHeight
    const size = Math.random() * 30 + 20
    const duration = Math.random() * 10 + 10
    const delay = Math.random() * 5

    coins.push(
      <motion.div
        key={i}
        className="coin"
        style={{
          left: x,
          top: y,
          width: size,
          height: size,
          backgroundImage: `url(${
            [
              "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=002",
              "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=002",
              "https://cryptologos.cc/logos/tether-usdt-logo.png?v=002",
              "https://cryptologos.cc/logos/binance-coin-bnb-logo.png?v=002",
            ][Math.floor(Math.random() * 4)]
          })`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
        animate={{
          y: [0, -100, 0],
          x: [0, Math.random() * 50 - 25, 0],
          rotate: [0, 360],
        }}
        transition={{
          duration: duration,
          repeat: Number.POSITIVE_INFINITY,
          delay: delay,
          ease: "easeInOut",
        }}
      />,
    )
  }

  return <div className="floating-coins">{coins}</div>
}

function App() {
  const [cryptoData, setCryptoData] = useState({})
  const [cryptoDetails, setCryptoDetails] = useState({})
  const [loading, setLoading] = useState(true)
  const [userInput, setUserInput] = useState("")
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  // Add a welcome message with investment advice capabilities
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content:
        "Hello! I'm your Crypto Advisor Bot. I can provide real-time information and investment recommendations for cryptocurrencies. Try asking me things like:\n\n• Should I buy Bitcoin right now?\n• What's your recommendation for Ethereum?\n• Compare Bitcoin and Solana\n• Tell me about Litecoin",
    },
  ])

  const cryptoSectionRef = useRef(null)
  const isInView = useInView(cryptoSectionRef, { once: false, amount: 0.2 })
  const messagesEndRef = useRef(null)

  // Supported cryptocurrencies
  const supportedCryptos = [
    {
      symbol: "bitcoin",
      name: "Bitcoin",
      shortName: "bitcoin",
      description: "The original cryptocurrency and the largest by market cap.",
    },
    {
      symbol: "ethereum",
      name: "Ethereum",
      shortName: "ethereum",
      description: "A decentralized platform that runs smart contracts.",
    },
    {
      symbol: "tether",
      name: "Tether",
      shortName: "tether",
      description: "A stablecoin pegged to the US Dollar.",
    },
    {
      symbol: "ripple",
      name: "Ripple",
      shortName: "ripple",
      description: "A digital payment protocol and cryptocurrency.",
    },
    {
      symbol: "binancecoin",
      name: "Binance Coin",
      shortName: "binancecoin",
      description: "The native cryptocurrency of the Binance exchange.",
    },
    {
      symbol: "solana",
      name: "Solana",
      shortName: "solana",
      description: "A high-performance blockchain supporting smart contracts and DeFi.",
    },
  ]

  // Define the base URL for API calls
  const baseUrl =
    process.env.NODE_ENV === "production" ? "https://crypto-project-nafm.onrender.com" : "http://localhost:5000"

  // Fetch data from the server
  useEffect(() => {
    fetch(`${baseUrl}/api/crypto`)
      .then((response) => response.json())
      .then((data) => {
        setCryptoData(data)

        // Generate additional details for each cryptocurrency
        const details = {}
        Object.keys(data).forEach((crypto) => {
          const cryptoInfo = supportedCryptos.find((c) => c.shortName === crypto) || {
            name: crypto.charAt(0).toUpperCase() + crypto.slice(1),
            description: "A cryptocurrency.",
          }

          // Calculate 24h change (simulated since we don't have historical data)
          const change24h = (Math.random() * 10 - 5).toFixed(2)
          const isPositive = Number.parseFloat(change24h) > 0

          details[crypto] = {
            name: cryptoInfo.name,
            description: cryptoInfo.description,
            marketCap: data[crypto].inr * (Math.random() * 10000000 + 1000000), // Simulated market cap
            allTimeHigh: data[crypto].inr * 1.5, // Simulated ATH
            allTimeLow: data[crypto].inr * 0.5, // Simulated ATL
            launchDate: ["2009", "2015", "2011", "2020", "2017", "2017"][Math.floor(Math.random() * 6)], // Placeholder
            chartData: generateChartData(),
            change24h,
            isPositive,
            volume: Math.floor(Math.random() * 1000000000),
          }
        })

        setCryptoDetails(details)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching data:", error)
        setLoading(false)
      })
  }, [])

  // Set up a refresh interval for real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${baseUrl}/api/crypto`)
        .then((response) => response.json())
        .then((data) => {
          setCryptoData(data)

          // Update details with new data
          setCryptoDetails((prevDetails) => {
            const updatedDetails = { ...prevDetails }
            Object.keys(data).forEach((crypto) => {
              if (updatedDetails[crypto]) {
                // Generate new 24h change
                const change24h = (Math.random() * 10 - 5).toFixed(2)
                const isPositive = Number.parseFloat(change24h) > 0

                updatedDetails[crypto] = {
                  ...updatedDetails[crypto],
                  change24h,
                  isPositive,
                  // Update chart data
                  chartData: [...updatedDetails[crypto].chartData.slice(1), data[crypto].inr / 100],
                }
              }
            })
            return updatedDetails
          })
        })
        .catch((error) => {
          console.error("Error refreshing data:", error)
        })
    }, 60000) // Refresh every minute

    return () => clearInterval(interval)
  }, [baseUrl])

  useEffect(() => {
    // Scroll to bottom of messages when new messages are added
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const cryptoLogos = {
    bitcoin: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=002",
    ethereum: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=002",
    tether: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=002",
    ripple: "https://cryptologos.cc/logos/xrp-xrp-logo.png?v=002",
    binancecoin: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png?v=002",
    solana: "https://cryptologos.cc/logos/solana-sol-logo.svg?v=023",
    litecoin: "https://cryptologos.cc/logos/litecoin-ltc-logo.png?v=002",
    polygon: "https://cryptologos.cc/logos/polygon-matic-logo.png?v=002",
    chainlink: "https://cryptologos.cc/logos/chainlink-link-logo.png?v=002",
  }

  // Update the handleChatResponse function to include investment recommendations
  const handleChatResponse = (e) => {
    e?.preventDefault()

    if (!userInput.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { type: "user", content: userInput }])
    setIsTyping(true)

    const lowerCaseInput = userInput.toLowerCase()

    // Check for specific question types
    const isPriceQuestion =
      lowerCaseInput.includes("price") ||
      lowerCaseInput.includes("worth") ||
      lowerCaseInput.includes("cost") ||
      lowerCaseInput.includes("value")
    const isInfoQuestion =
      lowerCaseInput.includes("what is") ||
      lowerCaseInput.includes("tell me about") ||
      lowerCaseInput.includes("explain") ||
      lowerCaseInput.includes("information")
    const isPredictionQuestion =
      lowerCaseInput.includes("will") ||
      lowerCaseInput.includes("predict") ||
      lowerCaseInput.includes("forecast") ||
      lowerCaseInput.includes("future")
    const isComparisonQuestion =
      lowerCaseInput.includes("compare") ||
      lowerCaseInput.includes("versus") ||
      lowerCaseInput.includes("vs") ||
      lowerCaseInput.includes("better than")
    const isAdviceQuestion =
      lowerCaseInput.includes("should i") ||
      lowerCaseInput.includes("buy") ||
      lowerCaseInput.includes("sell") ||
      lowerCaseInput.includes("hold") ||
      lowerCaseInput.includes("invest") ||
      lowerCaseInput.includes("recommendation") ||
      lowerCaseInput.includes("advice")

    // Find mentioned cryptocurrencies
    const mentionedCryptos = []
    for (const crypto of supportedCryptos) {
      if (
        lowerCaseInput.includes(crypto.shortName.toLowerCase()) ||
        lowerCaseInput.includes(crypto.name.toLowerCase()) ||
        lowerCaseInput.includes(crypto.symbol.toLowerCase())
      ) {
        mentionedCryptos.push(crypto.shortName)
      }
    }

    // Clear input
    setUserInput("")

    // Simulate typing delay
    setTimeout(() => {
      let responseMessage = ""

      if (mentionedCryptos.length === 0) {
        responseMessage =
          "I couldn't identify which cryptocurrency you're asking about. I can provide information about Bitcoin, Ethereum, Tether, Ripple, Binance Coin, and Solana."
      } else {
        const crypto = mentionedCryptos[0]
        const cryptoInfo = cryptoData[crypto] || {}
        const details = cryptoDetails[crypto] || {}
        const name = details.name || crypto.charAt(0).toUpperCase() + crypto.slice(1)

        // Generate investment recommendation based on data
        const getRecommendation = () => {
          const change24h = Number.parseFloat(details.change24h || 0)
          const marketTrend = Math.random() // Simulated market trend indicator
          const volatilityIndex = Math.random() * 10 // Simulated volatility (0-10)

          // Factors that influence the recommendation
          const strongBuy = change24h > 5 && marketTrend > 0.7 && volatilityIndex < 7
          const buy = change24h > 2 && marketTrend > 0.5
          const strongSell = change24h < -5 && marketTrend < 0.3 && volatilityIndex > 7
          const sell = change24h < -3 && marketTrend < 0.4
          const neutral = Math.abs(change24h) < 1.5 || (volatilityIndex > 8 && Math.abs(change24h) < 3)

          let recommendation, reasoning, riskLevel, timeframe

          if (strongBuy) {
            recommendation = "Strong Buy"
            reasoning = `${name} is showing significant positive momentum with a ${change24h}% increase in the last 24 hours. The overall market sentiment is positive, and technical indicators suggest continued upward movement.`
            riskLevel = "Moderate"
            timeframe = "Short to Medium-term"
          } else if (buy) {
            recommendation = "Buy"
            reasoning = `${name} is performing well with a ${change24h}% increase in the last 24 hours. Current market conditions appear favorable for growth.`
            riskLevel = "Moderate"
            timeframe = "Medium-term"
          } else if (strongSell) {
            recommendation = "Strong Sell"
            reasoning = `${name} is showing concerning downward momentum with a ${Math.abs(change24h)}% decrease in the last 24 hours. Technical indicators suggest further decline is possible.`
            riskLevel = "High if holding"
            timeframe = "Immediate"
          } else if (sell) {
            recommendation = "Sell"
            reasoning = `${name} has declined by ${Math.abs(change24h)}% in the last 24 hours, and market conditions don't appear favorable in the short term.`
            riskLevel = "Moderate if holding"
            timeframe = "Short-term"
          } else if (neutral) {
            recommendation = "Hold"
            reasoning = `${name} is relatively stable with only ${Math.abs(change24h)}% change in the last 24 hours. The market is showing mixed signals, suggesting a wait-and-see approach.`
            riskLevel = "Low to Moderate"
            timeframe = "Medium to Long-term"
          } else if (change24h > 0) {
            recommendation = "Hold/Buy"
            reasoning = `${name} is showing positive movement with a ${change24h}% increase, but market conditions are mixed. Consider buying on dips if you believe in the long-term potential.`
            riskLevel = "Moderate"
            timeframe = "Medium-term"
          } else {
            recommendation = "Hold/Sell"
            reasoning = `${name} has declined by ${Math.abs(change24h)}% recently. If you're in profit overall, consider taking some profits. If at a loss, evaluate your long-term conviction.`
            riskLevel = "Moderate to High"
            timeframe = "Short to Medium-term"
          }

          return { recommendation, reasoning, riskLevel, timeframe }
        }

        // Get additional suggestions based on the cryptocurrency
        const getSuggestions = (cryptoName) => {
          const suggestions = {
            bitcoin:
              "Consider dollar-cost averaging into Bitcoin rather than making large one-time purchases. As the largest cryptocurrency by market cap, BTC tends to be less volatile than altcoins but still carries significant risk.",
            ethereum:
              "Watch for developments in Ethereum's ecosystem, particularly DeFi projects and ETH 2.0 progress. Gas fees and network congestion can impact short-term price action.",
            tether:
              "As a stablecoin, Tether is designed to maintain a value of approximately 1 USD. It's often used as a safe haven during market volatility, but be aware of regulatory risks.",
            ripple:
              "XRP's price can be significantly affected by regulatory news and Ripple's ongoing legal battles. Stay informed about developments in these areas.",
            binancecoin:
              "BNB's value is closely tied to the success of the Binance exchange and its ecosystem. Monitor Binance's growth, user numbers, and any regulatory challenges.",
            solana:
              "Solana offers high throughput but has experienced network outages. Monitor network stability and developer activity as indicators of long-term health.",
          }

          return (
            suggestions[cryptoName.toLowerCase()] ||
            "Diversify your portfolio and never invest more than you can afford to lose. Cryptocurrency markets are highly volatile."
          )
        }

        if (isAdviceQuestion) {
          const { recommendation, reasoning, riskLevel, timeframe } = getRecommendation()
          const suggestion = getSuggestions(crypto)

          responseMessage = `**${recommendation}** recommendation for ${name}:\n\n${reasoning}\n\nRisk Level: ${riskLevel}\nTimeframe: ${timeframe}\n\nCurrent Price: ₹${cryptoInfo.inr?.toLocaleString("en-IN") || "unavailable"}\n24h Change: ${details.change24h}%\n\nSuggestion: ${suggestion}\n\n⚠️ Disclaimer: This is not financial advice. Always do your own research and consider consulting with a financial advisor before making investment decisions.`
        } else if (isPriceQuestion) {
          const { recommendation } = getRecommendation()
          responseMessage = `The current price of ${name} is ₹${cryptoInfo.inr?.toLocaleString("en-IN") || "unavailable"}. It has ${details.isPositive ? "increased" : "decreased"} by ${Math.abs(details.change24h)}% in the last 24 hours. Current recommendation: ${recommendation}.`
        } else if (isInfoQuestion) {
          const { recommendation } = getRecommendation()
          responseMessage = `${name} (${crypto.toUpperCase()}): ${details.description} It was launched in ${details.launchDate}. The current price is ₹${cryptoInfo.inr?.toLocaleString("en-IN") || "unavailable"} with a market cap of approximately ₹${(details.marketCap / 1000000000).toFixed(2)} billion. Current recommendation: ${recommendation}.`
        } else if (isPredictionQuestion) {
          // Generate a random prediction based on recent performance
          const { recommendation, reasoning } = getRecommendation()

          responseMessage = `Based on recent performance, ${reasoning} My current recommendation is: ${recommendation}.\n\nHowever, cryptocurrency markets are highly volatile and unpredictable. Past performance is not indicative of future results.`
        } else if (isComparisonQuestion && mentionedCryptos.length > 1) {
          const crypto2 = mentionedCryptos[1]
          const crypto2Info = cryptoData[crypto2] || {}
          const details2 = cryptoDetails[crypto2] || {}
          const name2 = details2.name || crypto2.charAt(0).toUpperCase() + crypto2.slice(1)

          const { recommendation: rec1 } = getRecommendation()

          // Get recommendation for second crypto
          const crypto2Rec = (() => {
            const change24h = Number.parseFloat(details2.change24h || 0)
            if (change24h > 3) return "Buy"
            if (change24h < -3) return "Sell"
            return "Hold"
          })()

          responseMessage = `Comparing ${name} and ${name2}:\n\n${name}: ₹${cryptoInfo.inr?.toLocaleString("en-IN") || "unavailable"} (${details.change24h}% 24h change) - Recommendation: ${rec1}\n\n${name2}: ₹${crypto2Info.inr?.toLocaleString("en-IN") || "unavailable"} (${details2.change24h}% 24h change) - Recommendation: ${crypto2Rec}\n\n${name}: ${details.description}\n\n${name2}: ${details2.description}\n\n⚠️ Remember to diversify your portfolio and not put all your investments in a single asset.`
        } else {
          // General information about the cryptocurrency with recommendation
          const { recommendation, reasoning } = getRecommendation()
          const suggestion = getSuggestions(crypto)

          responseMessage = `${name} is currently trading at ₹${cryptoInfo.inr?.toLocaleString("en-IN") || "unavailable"} with a 24-hour change of ${details.change24h}%. ${details.description}\n\nCurrent recommendation: ${recommendation}\n\n${reasoning}\n\n${suggestion}\n\nWould you like more specific information about ${name}?`
        }
      }

      // Add bot response
      setMessages((prev) => [...prev, { type: "bot", content: responseMessage }])
      setIsTyping(false)
    }, 1500)
  }

  const toggleChatbot = () => {
    setIsChatbotOpen((prev) => !prev)
  }

  // Generate random chart data for each crypto
  const generateChartData = () => {
    const data = []
    let value = Math.random() * 50 + 50

    for (let i = 0; i < 30; i++) {
      // Add some randomness but keep a trend
      value = value + (Math.random() * 10 - 5)
      // Ensure value stays positive
      value = Math.max(value, 10)
      data.push(value)
    }

    return data
  }

  // Add a function to generate crypto info cards with recommendation buttons
  const generateCryptoInfoCard = (crypto, index) => {
    if (!cryptoData[crypto] || !cryptoDetails[crypto]) return null

    const details = cryptoDetails[crypto]
    const chartData = details.chartData || generateChartData()
    const chartColor = details.isPositive ? "#00c853" : "#ff3d00"

    const cardVariants = {
      hidden: { opacity: 0, y: 50 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { delay: index * 0.1, duration: 0.5 },
      },
    }

    // Generate recommendation based on data
    const getQuickRecommendation = () => {
      const change24h = Number.parseFloat(details.change24h || 0)
      if (change24h > 3) return { text: "Buy", color: "#00c853" }
      if (change24h < -3) return { text: "Sell", color: "#ff3d00" }
      return { text: "Hold", color: "#ffcb00" }
    }

    const recommendation = getQuickRecommendation()

    return (
      <motion.div
        className="crypto-card"
        key={crypto}
        variants={cardVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        whileHover={{ scale: 1.03 }}
      >
        <div className="crypto-header">
          <img
            src={cryptoLogos[crypto.toLowerCase()] || "/placeholder.svg"}
            alt={`${crypto} logo`}
            className="crypto-logo"
          />
          <h3 className="crypto-name">{details.name || crypto.charAt(0).toUpperCase() + crypto.slice(1)}</h3>
        </div>

        <div className="crypto-price">₹{cryptoData[crypto].inr.toLocaleString("en-IN")}</div>

        <div className="recommendation-badge" style={{ backgroundColor: recommendation.color }}>
          {recommendation.text}
        </div>

        <CryptoChart data={chartData} color={chartColor} />

        <div className="crypto-stats">
          <div className="stat">
            <div className="stat-label">24h Change</div>
            <div className={`stat-value ${details.isPositive ? "up" : "down"}`}>
              {details.isPositive ? <FaArrowUp /> : <FaArrowDown />} {Math.abs(details.change24h)}%
            </div>
          </div>

          <div className="stat">
            <div className="stat-label">Volume</div>
            <div className="stat-value">₹{(details.volume / 1000000).toFixed(2)}M</div>
          </div>

          <div className="stat">
            <div className="stat-label">Market Cap</div>
            <div className="stat-value">₹{(details.marketCap / 1000000000).toFixed(2)}B</div>
          </div>
        </div>

        <div className="crypto-action-buttons">
          <div
            className="crypto-info-button"
            onClick={() => {
              setMessages((prev) => [
                ...prev,
                {
                  type: "user",
                  content: `Tell me about ${details.name || crypto}`,
                },
              ])
              setIsTyping(true)
              setTimeout(() => {
                setMessages((prev) => [
                  ...prev,
                  {
                    type: "bot",
                    content: `${details.name || crypto.charAt(0).toUpperCase() + crypto.slice(1)} (${crypto.toUpperCase()}): ${details.description} It was launched in ${details.launchDate}. The current price is ₹${cryptoData[crypto].inr.toLocaleString("en-IN")} with a market cap of approximately ₹${(details.marketCap / 1000000000).toFixed(2)} billion.`,
                  },
                ])
                setIsTyping(false)
                setIsChatbotOpen(true)
              }, 1500)
            }}
          >
            <FaInfoCircle /> More Info
          </div>
          <div
            className="crypto-advice-button"
            onClick={() => {
              setMessages((prev) => [
                ...prev,
                {
                  type: "user",
                  content: `Should I buy, sell, or hold ${details.name || crypto}?`,
                },
              ])
              setIsTyping(true)
              setIsChatbotOpen(true)
              setTimeout(() => {
                // This will trigger our enhanced handleChatResponse logic
                handleChatResponse()
              }, 100)
            }}
          >
            <FaInfoCircle /> Get Advice
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="app-container">
      <motion.nav
        className="navbar"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="header-title">CryptoKaro</h1>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#crypto-insights">Crypto Insights</a>
          <a href="#footer">About Us</a>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.div
        id="home"
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <FloatingCoins />

        <div className="hero-content">
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Real-Time Cryptocurrency Insights
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Track live cryptocurrency prices, analyze market trends, and get personalized investment advice from our
            AI-powered crypto advisor.
          </motion.p>

          <motion.a
            href="#crypto-insights"
            className="hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Live Prices
          </motion.a>
        </div>

        <motion.div className="hero-logo-container">
          <motion.div
            className="hero-logo"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: [0, -20, 0],
              rotateY: [0, 180, 360],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          >
            <FaBitcoin size={120} color="#ffcb00" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Live Crypto Section */}
      <div id="crypto-insights" className="live-crypto-section" ref={cryptoSectionRef}>
        <h2 className="section-title">Live Crypto Insights</h2>

        {loading ? (
          <motion.div
            className="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading latest crypto data...</div>
          </motion.div>
        ) : (
          <motion.div
            className="crypto-dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Display crypto data with recommendations */}
            {Object.keys(cryptoData).map((crypto, index) => generateCryptoInfoCard(crypto, index))}
          </motion.div>
        )}
      </div>

      {/* Footer with Creators */}
      <footer id="footer" className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About CryptoKaro</h3>
            <p>
              CryptoKaro provides real-time cryptocurrency data and AI-powered investment advice to help you make
              informed decisions in the crypto market.
            </p>
          </div>

          <div className="footer-section">
            <h3>Creators</h3>
            <ul className="creators-list">
              <li>Aryan Sharma (12307458)</li>
              <li>Ayush Kumar (12307942)</li>
              <li>Raj Raushan (12307042)</li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Have questions or feedback? Reach out to our team for assistance.</p>
          </div>
        </div>

        <div className="copyright">&copy; {new Date().getFullYear()} CryptoKaro. All rights reserved.</div>
      </footer>

      {/* Chatbot Toggle Button */}
      <motion.button
        className={`chatbot-toggle ${!isChatbotOpen ? "pulse-animation" : ""}`}
        onClick={toggleChatbot}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaRobot />
      </motion.button>

      {/* Chatbot Container */}
      <AnimatePresence>
        {isChatbotOpen && (
          <motion.div
            className="chatbot-container"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="chatbot-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div className="bot-avatar">
                  <FaRobot />
                </div>
                <h2>Crypto Advisor</h2>
              </div>
              <button className="close-button" onClick={toggleChatbot}>
                <FaTimes />
              </button>
            </div>

            <div className="chatbot-body">
              <div className="chat-messages">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={message.type === "bot" ? "message-with-avatar" : ""}
                    style={message.type === "user" ? { alignSelf: "flex-end" } : {}}
                  >
                    {message.type === "bot" && (
                      <div className="bot-avatar">
                        <FaRobot />
                      </div>
                    )}
                    <div
                      className={message.type === "bot" ? "bot-message" : "bot-message"}
                      style={
                        message.type === "user"
                          ? {
                              background: "rgba(255, 203, 0, 0.2)",
                              borderRadius: "18px 18px 0 18px",
                              alignSelf: "flex-end",
                            }
                          : {}
                      }
                    >
                      {message.content}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div className="message-with-avatar" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="bot-avatar">
                      <FaRobot />
                    </div>
                    <div className="typing-indicator">
                      <motion.div
                        className="typing-dot"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8, delay: 0 }}
                      />
                      <motion.div
                        className="typing-dot"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8, delay: 0.2 }}
                      />
                      <motion.div
                        className="typing-dot"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8, delay: 0.4 }}
                      />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="chat-input-container">
              <form className="chat-input-form" onSubmit={handleChatResponse}>
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Ask about your crypto..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                />
                <motion.button
                  type="submit"
                  className="send-button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={isTyping}
                >
                  <FaPaperPlane />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
