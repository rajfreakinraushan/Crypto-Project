"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { FaPaperPlane, FaRobot, FaTimes, FaArrowUp, FaArrowDown, FaBitcoin } from "react-icons/fa"
import Chart from "chart.js/auto"
import "./App.css"

// Chart Component
function CryptoChart({ data, color }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart
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
  const [loading, setLoading] = useState(true)
  const [userInput, setUserInput] = useState("")
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState([
    { type: "bot", content: "Hello! I'm your Crypto Advisor Bot. Ask me about any cryptocurrency!" },
  ])

  const cryptoSectionRef = useRef(null)
  const isInView = useInView(cryptoSectionRef, { once: false, amount: 0.2 })
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const baseURL =
      process.env.NODE_ENV === "development"
        ? "http://localhost:5000"
        : "https://crypto-project-nafm.onrender.com";
  
    fetch(`${baseURL}/api/crypto`)
      .then((response) => response.json())
      .then((data) => {
        setCryptoData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);
  

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
  }

  const handleChatResponse = (e) => {
    e?.preventDefault()

    if (!userInput.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { type: "user", content: userInput }])
    setIsTyping(true)

    const lowerCaseInput = userInput.toLowerCase()
    const detectedCoin = Object.keys(cryptoData).find((coin) => lowerCaseInput.includes(coin.toLowerCase()))

    // Clear input
    setUserInput("")

    // Simulate typing delay
    setTimeout(() => {
      let responseMessage = ""

      if (!detectedCoin) {
        responseMessage = "I couldn't find the cryptocurrency in your question. Please try again!"
      } else {
        const currentPrice = cryptoData[detectedCoin]?.inr || 0
        const trend = Math.random() // Simulating a trend (real logic can be added here)

        if (trend > 0.6) {
          responseMessage = `Yes! The price of ${detectedCoin} is likely to rise further. Holding might be a good option!`
        } else if (trend < 0.4) {
          responseMessage = `The price of ${detectedCoin} is showing a downward trend. Selling might be a safer option!`
        } else {
          responseMessage = `The price of ${detectedCoin} is stable for now. You can hold it and wait for better opportunities.`
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

  // Generate random stats for crypto cards
  const generateStats = () => {
    const change24h = (Math.random() * 10 - 5).toFixed(2)
    const volume = Math.floor(Math.random() * 1000000000)
    const marketCap = Math.floor(Math.random() * 10000000000)

    return {
      change24h,
      volume,
      marketCap,
      isPositive: change24h > 0,
    }
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
            {Object.keys(cryptoData).map((crypto, index) => {
              const stats = generateStats()
              const chartData = generateChartData()
              const chartColor = stats.isPositive ? "#00c853" : "#ff3d00"

              const cardVariants = {
                hidden: { opacity: 0, y: 50 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { delay: index * 0.1, duration: 0.5 },
                },
              }

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
                    <h3 className="crypto-name">{crypto.charAt(0).toUpperCase() + crypto.slice(1)}</h3>
                  </div>

                  <div className="crypto-price">₹{cryptoData[crypto].inr.toLocaleString("en-IN")}</div>

                  <CryptoChart data={chartData} color={chartColor} />

                  <div className="crypto-stats">
                    <div className="stat">
                      <div className="stat-label">24h Change</div>
                      <div className={`stat-value ${stats.isPositive ? "up" : "down"}`}>
                        {stats.isPositive ? <FaArrowUp /> : <FaArrowDown />} {stats.change24h}%
                      </div>
                    </div>

                    <div className="stat">
                      <div className="stat-label">Volume</div>
                      <div className="stat-value">₹{(stats.volume / 1000000).toFixed(2)}M</div>
                    </div>

                    <div className="stat">
                      <div className="stat-label">Market Cap</div>
                      <div className="stat-value">₹{(stats.marketCap / 1000000000).toFixed(2)}B</div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
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

