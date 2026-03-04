import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cloud, X, Send, Bot, User, Mic, MicOff, Volume2 } from 'lucide-react'

const ChatBot = ({ currentWeather, forecast }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Hi! I\'m your weather assistant. Ask me anything about the weather! 🌤️',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const recognitionRef = useRef(null)
  const synthRef = useRef(null)

  // Check voice support on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const speechSynthesis = window.speechSynthesis
    
    if (SpeechRecognition && speechSynthesis) {
      setVoiceSupported(true)
      synthRef.current = speechSynthesis
      
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
        // Auto-send after voice input
        setTimeout(() => {
          handleSendMessage(transcript)
        }, 300)
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please enable microphone permissions.')
        }
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateResponse = (userMessage) => {
    const message = userMessage.toLowerCase().trim()

    // No weather data available
    if (!currentWeather) {
      return "Please search for a city first to get weather information! 🔍"
    }

    const temp = Math.round(currentWeather.main.temp)
    const condition = currentWeather.weather[0].main
    const city = currentWeather.name
    const humidity = currentWeather.main.humidity
    const windSpeed = currentWeather.wind.speed.toFixed(1)
    const windSpeedRounded = Math.round(currentWeather.wind.speed)
    const feelsLike = Math.round(currentWeather.main.feels_like)
    const pressure = currentWeather.main.pressure
    const visibility = (currentWeather.visibility / 1000).toFixed(1)
    const cloudiness = currentWeather.clouds?.all || 0

    // Helper function to get emoji for condition
    const getWeatherEmoji = (cond) => {
      const c = cond.toLowerCase()
      if (c.includes('clear') || c.includes('sunny')) return '☀️'
      if (c.includes('cloud')) return '☁️'
      if (c.includes('rain') || c.includes('drizzle')) return '🌧️'
      if (c.includes('snow')) return '❄️'
      if (c.includes('storm') || c.includes('thunder')) return '⛈️'
      if (c.includes('mist') || c.includes('fog')) return '🌫️'
      if (c.includes('haze')) return '🌫️'
      return '🌤️'
    }

    // Helper function to get wind direction description
    const getWindDescription = (speed) => {
      if (speed < 2) return 'calm, almost no wind'
      if (speed < 5) return 'light breeze'
      if (speed < 10) return 'gentle wind'
      if (speed < 15) return 'moderate wind'
      if (speed < 20) return 'strong wind'
      return 'very strong wind'
    }

    // Helper function for clothing advice
    const getClothingAdvice = () => {
      let advice = ''
      if (temp > 30) advice = 'light, breathable summer clothing, shorts, t-shirts, and sunscreen ☀️👕'
      else if (temp > 20) advice = 'light jacket or long sleeves 🧥👔'
      else if (temp > 10) advice = 'warm jacket and layers 🧥🧣'
      else if (temp > 0) advice = 'heavy winter coat, gloves, and scarf 🧥🧤🧣'
      else advice = 'heavy insulated coat, thermal wear, gloves, scarf, and hat 🧥🧤🧣🎩'
      
      if (condition.toLowerCase().includes('rain')) advice += ' and an umbrella ☔'
      if (windSpeedRounded > 15) advice += ' and a windproof jacket 💨'
      return advice
    }

    // WEATHER PHENOMENA EXPLANATIONS (Haze, Fog, Mist, etc.)
    if (message.match(/\b(what is|what does|mean by|meaning of|explain|definition)\b/)) {
      // Check for specific weather terms
      if (message.match(/\b(haze|hazy)\b/)) {
        return `🌫️ **Haze** is a weather phenomenon where dust, smoke, and dry particles obscure the sky's clarity.\n\n**Current conditions in ${city}:**\n• Weather: ${condition}\n• Visibility: ${visibility} km ${visibility < 5 ? '(reduced due to haze)' : ''}\n• Temperature: ${temp}°C\n• Humidity: ${humidity}%\n\n**About Haze:**\n• Caused by fine particles suspended in the air\n• Often occurs in dry weather\n• Reduces visibility but doesn't mean moisture\n• Common in urban areas with pollution\n• Can affect air quality - limit outdoor exercise if severe\n\n**Safety Tips:**\n${visibility < 5 ? '⚠️ Visibility is reduced. Drive carefully with headlights on.' : '✅ Visibility is acceptable.'}`
      }
      
      if (message.match(/\b(fog|foggy)\b/)) {
        return `🌫️ **Fog** is a cloud at ground level, made of tiny water droplets suspended in the air.\n\n**Current conditions in ${city}:**\n• Weather: ${condition}\n• Visibility: ${visibility} km\n• Temperature: ${temp}°C\n• Humidity: ${humidity}%\n\n**About Fog:**\n• Forms when air temperature equals dew point\n• Requires high humidity (usually >90%)\n• Severely reduces visibility\n• Common in early morning/evening\n• Can make roads slippery\n\n**Safety:** Drive slowly, use low-beam headlights, and increase following distance.`
      }
      
      if (message.match(/\b(mist|misty)\b/)) {
        return `🌫️ **Mist** is similar to fog but less dense, with better visibility.\n\n**Current conditions in ${city}:**\n• Weather: ${condition}\n• Visibility: ${visibility} km\n• Temperature: ${temp}°C\n• Humidity: ${humidity}%\n\n**About Mist:**\n• Light fog with visibility >1 km\n• Made of tiny water droplets\n• Often occurs near water bodies\n• Creates a dreamy, romantic atmosphere\n• Usually dissipates as temperature rises\n\n**Difference:** Fog = visibility <1 km, Mist = visibility 1-2 km`
      }
      
      if (message.match(/\b(cloud|clouds|cloudy|overcast)\b/)) {
        return `☁️ **Clouds** are visible masses of water droplets or ice crystals suspended in the atmosphere.\n\n**Current conditions in ${city}:**\n• Weather: ${condition}\n• Cloud coverage: ${cloudiness}%\n• Temperature: ${temp}°C\n• Visibility: ${visibility} km\n\n**Types of clouds:**\n• Cumulus - puffy, cotton-like (fair weather)\n• Stratus - layered, gray (overcast)\n• Cirrus - wispy, high altitude (change coming)\n• Cumulonimbus - towering (thunderstorms)\n\n**Today:** ${cloudiness > 75 ? 'Mostly overcast ☁️' : cloudiness > 50 ? 'Partly cloudy ⛅' : cloudiness > 25 ? 'Few clouds 🌤️' : 'Clear skies ☀️'}`
      }
      
      if (message.match(/\b(rain|drizzle|shower)\b/)) {
        return `🌧️ **Rain** is liquid precipitation falling from clouds.\n\n**Current conditions in ${city}:**\n• Weather: ${condition}\n• Temperature: ${temp}°C\n• Humidity: ${humidity}%\n• Cloud coverage: ${cloudiness}%\n\n**Types of rain:**\n• Drizzle - light, fine droplets (<0.5mm)\n• Light rain - 0.5-2.5mm per hour\n• Moderate rain - 2.5-7.5mm per hour\n• Heavy rain - >7.5mm per hour\n• Showers - brief, varying intensity\n\n${condition.toLowerCase().includes('rain') ? '☔ Bring an umbrella!' : '✅ No rain currently'}`
      }
      
      if (message.match(/\b(snow|snowy|blizzard)\b/)) {
        return `❄️ **Snow** is frozen precipitation in the form of ice crystals.\n\n**Current conditions in ${city}:**\n• Weather: ${condition}\n• Temperature: ${temp}°C ${temp > 0 ? '(too warm for snow)' : '(cold enough for snow)'}\n• Humidity: ${humidity}%\n\n**About Snow:**\n• Forms when temperature <0°C\n• Requires moisture in clouds\n• Each snowflake is unique\n• Light snow: <1 cm/hour\n• Heavy snow: >5 cm/hour\n• Blizzard: heavy snow + strong winds\n\n**Safety:** Dress warmly, drive carefully, watch for ice.`
      }
      
      if (message.match(/\b(storm|thunder|lightning)\b/)) {
        return `⛈️ **Thunderstorm** is a storm with lightning, thunder, heavy rain, and sometimes hail.\n\n**Current conditions in ${city}:**\n• Weather: ${condition}\n• Temperature: ${temp}°C\n• Cloud coverage: ${cloudiness}%\n• Pressure: ${pressure} hPa\n\n**About Thunderstorms:**\n• Caused by unstable atmospheric conditions\n• Lightning heats air, creating thunder\n• Can produce heavy rain, hail, strong winds\n• Usually last 30 minutes to an hour\n• Most common in afternoon/evening\n\n**Safety:**\n${condition.toLowerCase().includes('storm') ? '⚠️ STAY INDOORS! Avoid windows, water, and electronics. Do not use corded phones.' : '✅ No storm currently - you\'re safe!'}`
      }
      
      if (message.match(/\b(clear|sunny|sunshine)\b/)) {
        return `☀️ **Clear Weather** means no significant clouds and excellent visibility.\n\n**Current conditions in ${city}:**\n• Weather: ${condition}\n• Temperature: ${temp}°C\n• Cloud coverage: ${cloudiness}%\n• Visibility: ${visibility} km\n\n**About Clear Weather:**\n• Less than 10% cloud cover\n• Maximum solar radiation\n• Great for outdoor activities\n• Can be very hot during day\n• Can be very cold at night (no cloud insulation)\n\n**Tips:**\n${cloudiness < 25 ? '☀️ Use sunscreen and stay hydrated!' : '⛅ Some clouds present'}`
      }
      
      if (message.match(/\b(wind|breeze|gale)\b/)) {
        return `💨 **Wind** is the movement of air from high to low pressure areas.\n\n**Current conditions in ${city}:**\n• Wind Speed: ${windSpeed} m/s\n• Description: ${getWindDescription(windSpeed)}\n• Temperature: ${temp}°C\n\n**Wind Scale (Beaufort):**\n• 0-2 m/s - Calm\n• 2-5 m/s - Light breeze\n• 5-10 m/s - Moderate wind\n• 10-15 m/s - Fresh wind\n• 15-20 m/s - Strong wind\n• >20 m/s - Gale/Storm\n\n**Current status:** ${windSpeedRounded > 15 ? '⚠️ Strong winds - be cautious!' : windSpeedRounded > 10 ? '🌬️ Breezy conditions' : '🍃 Calm to light winds'}`
      }
    }

    // TEMPERATURE QUESTIONS
    if (message.match(/\b(temperature|temp|how hot|how cold|degree)\b/)) {
      return `In ${city}, it's currently ${temp}°C with ${condition.toLowerCase()} conditions. It feels like ${feelsLike}°C. ${
        temp > 30 ? 'It\'s very hot! ☀️ Stay hydrated!' :
        temp > 25 ? 'It\'s warm and pleasant! 🌞' :
        temp > 15 ? 'It\'s mild and comfortable. 🌤️' :
        temp > 5 ? 'It\'s cool, bring a jacket. 🧥' :
        temp > -5 ? 'It\'s cold! ❄️ Bundle up!' :
        'It\'s extremely cold! 🥶 Be careful outside!'
      }`
    }

    // WEATHER CONDITION
    if (message.match(/\b(weather|condition|outside|what is it like)\b/)) {
      return `Right now in ${city}, it's ${condition.toLowerCase()} ${getWeatherEmoji(condition)}\n\nDetails:\n• Temperature: ${temp}°C (feels like ${feelsLike}°C)\n• Humidity: ${humidity}%\n• Wind: ${windSpeed} m/s (${getWindDescription(windSpeed)})\n• Visibility: ${visibility} km\n• Cloud coverage: ${cloudiness}%`
    }

    // HUMIDITY QUESTIONS
    if (message.match(/\b(humid|humidity|moisture|damp)\b/)) {
      return `The humidity in ${city} is ${humidity}%. ${
        humidity > 80 ? 'It\'s very humid! 💧 You might feel sticky and uncomfortable. Consider staying hydrated.' :
        humidity > 60 ? 'It\'s moderately humid. 💧 Comfortable for most activities.' :
        humidity > 40 ? 'The humidity is at a comfortable level. ✅' :
        'The air is quite dry. 🏜️ Remember to moisturize your skin and drink water.'
      }`
    }

    // WIND QUESTIONS
    if (message.match(/\b(wind|windy|breeze|gust|blow)\b/)) {
      return `Wind conditions in ${city}:\n• Speed: ${windSpeed} m/s\n• Description: ${getWindDescription(windSpeed)}\n\n${
        windSpeedRounded > 15 ? 'It\'s quite windy! 💨 Be careful of falling objects and secure loose items. Use caution when outside.' :
        windSpeedRounded > 10 ? 'There\'s a moderate to strong breeze. 🌬️ Comfortable for outdoor activities.' :
        windSpeedRounded > 5 ? 'There\'s a gentle breeze. 🍃 Nice for a walk!' :
        'It\'s very calm with minimal wind. 🍂'
      }`
    }

    // RAIN/PRECIPITATION
    if (message.match(/\b(rain|raining|wet|umbrella|precipitation|shower)\b/)) {
      if (condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('drizzle')) {
        return `Yes, it's currently ${condition.toLowerCase()} in ${city}! 🌧️\n\nRecommendations:\n• Take an umbrella ☔\n• Wear waterproof clothing 🧥\n• Be careful on wet surfaces\n• Drive carefully if you're going out\n\nHumidity is ${humidity}%, which is typical for rainy weather.`
      }
      if (condition.toLowerCase().includes('storm')) {
        return `There's a ${condition.toLowerCase()} in ${city}! ⛈️\n\nSafety tips:\n• Stay indoors if possible\n• Avoid open areas\n• Don't use electrical appliances\n• Keep away from windows\n• Listen to weather alerts`
      }
      return `No rain expected in ${city} right now. ${getWeatherEmoji(condition)} The weather is ${condition.toLowerCase()} and mostly dry.`
    }

    // TOMORROW/FORECAST
    if (message.match(/\b(tomorrow|forecast|next day|coming up|what\'s next)\b/)) {
      if (forecast && forecast.list && forecast.list.length > 8) {
        const tomorrow = forecast.list[8]
        const tomorrowTemp = Math.round(tomorrow.main.temp)
        const tomorrowCondition = tomorrow.weather[0].main
        const tempDiff = tomorrowTemp - temp
        const tempChange = tempDiff > 0 ? `📈 ${tempDiff}°C warmer` : tempDiff < 0 ? `📉 ${Math.abs(tempDiff)}°C cooler` : '➡️ Same temperature'
        
        return `Tomorrow's forecast for ${city}:\n\n• Condition: ${tomorrowCondition} ${getWeatherEmoji(tomorrowCondition)}\n• Temperature: ${tomorrowTemp}°C (${tempChange})\n• Humidity: ${tomorrow.main.humidity}%\n\nPrepare accordingly!`
      }
      return `I need forecast data to answer that. Try searching for a city first! 🔍`
    }

    // CLOTHING ADVICE
    if (message.match(/\b(wear|cloth|dress|outfit|suit|jacket|coat)\b/)) {
      return `Based on ${temp}°C weather in ${city}:\n\nI recommend: ${getClothingAdvice()}\n\nCurrent conditions:\n• Temperature: ${temp}°C\n• Feels like: ${feelsLike}°C\n• Wind: ${windSpeed} m/s\n• Humidity: ${humidity}%`
    }

    // PRESSURE
    if (message.match(/\b(pressure|barometric|atmospheric)\b/)) {
      return `The atmospheric pressure in ${city} is ${pressure} hPa.\n\n${
        pressure > 1020 ? 'High pressure - typically indicates fair weather ahead! ☀️' :
        pressure > 1010 ? 'Normal pressure - stable weather conditions. 🌤️' :
        pressure < 1000 ? 'Low pressure - often associated with rainy or stormy weather. 🌧️' :
        'Pressure is dropping - watch for weather changes! ⚠️'
      }`
    }

    // VISIBILITY
    if (message.match(/\b(visibility|see|view|distance|clear)\b/)) {
      return `Visibility in ${city} is ${visibility} km.\n\n${
        visibility > 10 ? 'Excellent visibility! 👀 Perfect for outdoor activities and driving.' :
        visibility > 5 ? 'Good visibility. 👁️ Safe for most activities.' :
        visibility > 1 ? 'Moderate visibility. ⚠️ Be cautious while driving.' :
        'Poor visibility! 🌫️ Use headlights and drive carefully.'
      }`
    }

    // SUNRISE/SUNSET
    if (message.match(/\b(sunrise|sunset|sun|dawn|dusk)\b/)) {
      const sunrise = new Date(currentWeather.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      const sunset = new Date(currentWeather.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      return `In ${city}:\n\n🌅 Sunrise: ${sunrise}\n🌇 Sunset: ${sunset}\n\nDaylight hours: ~${(new Date(currentWeather.sys.sunset * 1000) - new Date(currentWeather.sys.sunrise * 1000)) / (1000 * 60 * 60)} hours`
    }

    // LOCATION/CITY
    if (message.match(/\b(where|location|city|country)\b/)) {
      return `You're currently viewing weather for ${city}, ${currentWeather.sys.country}! 📍\n\nCoordinates: ${currentWeather.coord.lat.toFixed(2)}°N, ${currentWeather.coord.lon.toFixed(2)}°E`
    }

    // SAFE TO GO OUTSIDE
    if (message.match(/\b(outside|go out|play|safe|activities)\b/)) {
      let safety = ''
      let activities = ''
      
      if (condition.toLowerCase().includes('storm') || condition.toLowerCase().includes('thunder')) {
        safety = 'NOT recommended to go outside. ⛈️ It\'s dangerous!'
        activities = 'Stay indoors and do indoor activities.'
      } else if (condition.toLowerCase().includes('rain')) {
        safety = 'Not ideal, but possible with protection. 🌧️'
        activities = 'Bring an umbrella and wear waterproof clothing.'
      } else if (temp > 35) {
        safety = 'Caution needed. 🔥 It\'s very hot!'
        activities = 'Limit outdoor time, stay hydrated, use sunscreen.'
      } else if (temp < -10) {
        safety = 'Risky. ❄️ It\'s extremely cold!'
        activities = 'Bundle up heavily or stay indoors.'
      } else if (windSpeedRounded > 20) {
        safety = 'Caution needed. 💨 Strong winds!'
        activities = 'Avoid high areas or open fields.'
      } else {
        safety = 'Yes! It\'s safe and pleasant. ✅'
        activities = 'Perfect for outdoor activities like walking, jogging, or sports!'
      }
      
      return `Is it safe to go outside in ${city}?\n\n${safety}\n\nCurrent conditions: ${temp}°C, ${condition}, Wind: ${windSpeed} m/s\n\nRecommendation: ${activities}`
    }

    // HELP
    if (message.match(/\b(help|what can|how do|commands|options)\b/)) {
      return `I'm your Weather Assistant! 🌤️ I can answer questions about:\n\n🌡️ Temperature\n☁️ Weather conditions\n💧 Humidity levels\n💨 Wind speed\n🌧️ Rain & precipitation\n📅 Tomorrow's forecast\n👕 What to wear\n🌅 Sunrise/Sunset times\n📍 Location info\n✅ Is it safe to go outside?\n🔁 Atmospheric pressure\n👁️ Visibility\n\nJust ask me anything about the weather!`
    }

    // GREETING
    if (message.match(/\b(hello|hi|hey|greetings)\b/)) {
      return `Hey there! 👋 Welcome to your Weather Assistant! I'm here to help with all your weather questions for ${city}. What would you like to know?`
    }

    // THANK YOU
    if (message.match(/\b(thank|thanks|appreciate)\b/)) {
      return `You're welcome! 😊 Feel free to ask any other weather-related questions anytime!`
    }

    // DEFAULT - Weather overview
    return `Here's the current weather summary for ${city}:\n\n📍 Location: ${city}, ${currentWeather.sys.country}\n🌡️ Temperature: ${temp}°C (feels like ${feelsLike}°C)\n${getWeatherEmoji(condition)} Condition: ${condition}\n💧 Humidity: ${humidity}%\n💨 Wind: ${windSpeed} m/s\n🔍 Visibility: ${visibility} km\n⛅ Clouds: ${cloudiness}%\n🔌 Pressure: ${pressure} hPa\n\nAsk me anything specific about these conditions!`
  }

  const speak = (text) => {
    if (!voiceSupported || !voiceEnabled || !synthRef.current) return

    // Cancel any ongoing speech
    synthRef.current.cancel()

    // Clean text for better speech (remove emojis and special formatting)
    const cleanText = text
      .replace(/[🌤️☀️🌞☁️🌧️❄️⛈️🌫️💧💨🍃🌬️🍂☔🔥🧥🧣🧤🎩📍📈📉➡️✅⚠️👋😊🔍⛅🔌👁️🎯📅👕🌅🌇]/g, '')
      .replace(/\n+/g, '. ')
      .replace(/•/g, '')
      .replace(/\*\*/g, '')

    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1
    
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    synthRef.current.speak(utterance)
  }

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const handleSendMessage = (messageText) => {
    const textToSend = messageText || input
    if (!textToSend.trim()) return

    // Add user message
    const userMessage = {
      type: 'user',
      text: textToSend,
      timestamp: new Date()
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const responseText = generateResponse(textToSend)
      const botResponse = {
        type: 'bot',
        text: responseText,
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
      
      // Speak the response if voice is enabled
      if (voiceEnabled) {
        speak(responseText)
      }
    }, 800)
  }

  const handleSend = () => {
    handleSendMessage(input)
  }

  const handleVoiceInput = () => {
    if (!voiceSupported) {
      alert('Voice input is not supported in your browser. Please try Chrome or Edge.')
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      try {
        setIsListening(true)
        recognitionRef.current?.start()
      } catch (error) {
        console.error('Error starting speech recognition:', error)
        setIsListening(false)
      }
    }
  }

  const handleSend_old = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage = {
      type: 'user',
      text: input,
      timestamp: new Date()
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = {
        type: 'bot',
        text: generateResponse(input),
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 800)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <div className="fixed bottom-6 right-6 z-50 group">
            {/* Tooltip - only shows on hover */}
            <div className="absolute bottom-20 right-0 bg-white dark:bg-slate-800 text-gray-800 dark:text-white px-4 py-2 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 whitespace-nowrap invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 pointer-events-none">
              <p className="text-sm font-medium">💬 Ask me about the weather!</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Your AI Weather Assistant</p>
              {/* Tooltip arrow */}
              <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white dark:bg-slate-800 border-r border-b border-gray-200 dark:border-slate-700 transform rotate-45" />
            </div>
            
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white shadow-2xl flex items-center justify-center hover:shadow-blue-500/50 transition-all"
            >
              <Cloud size={32} />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold font-poppins">Weather Assistant</h3>
                  <p className="text-white/80 text-xs font-inter">
                    {isSpeaking ? '🔊 Speaking...' : 'Ask me anything!'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Voice toggle */}
                {voiceSupported && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setVoiceEnabled(!voiceEnabled)
                      if (isSpeaking) stopSpeaking()
                    }}
                    className="text-white/80 hover:text-white transition"
                    title={voiceEnabled ? "Disable voice responses" : "Enable voice responses"}
                  >
                    <Volume2 size={20} className={voiceEnabled ? '' : 'opacity-50'} />
                  </motion.button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-purple-500 text-white'
                    }`}>
                      {message.type === 'user' ? <User size={18} /> : <Bot size={18} />}
                    </div>
                    <div className={`rounded-2xl px-4 py-2 ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white'
                    }`}>
                      <p className="text-sm font-inter whitespace-pre-line">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                    <Bot size={18} className="text-white" />
                  </div>
                  <div className="bg-gray-100 dark:bg-slate-700 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-200 dark:border-slate-700">
              {isListening && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-2 text-center text-sm text-blue-500 dark:text-blue-400 font-medium"
                >
                  🎤 Listening...
                </motion.div>
              )}
              <div className="flex gap-2">
                {/* Voice Input Button */}
                {voiceSupported && (
                  <motion.button
                    type="button"
                    onClick={handleVoiceInput}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-2 rounded-xl transition flex items-center justify-center ${
                      isListening
                        ? 'bg-red-500 text-white'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                    }`}
                    title={isListening ? "Stop listening" : "Voice input"}
                  >
                    {isListening ? (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <MicOff size={18} />
                      </motion.div>
                    ) : (
                      <Mic size={18} />
                    )}
                  </motion.button>
                )}
                
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isListening ? "Listening..." : "Ask about weather..."}
                  className="flex-1 px-4 py-2 rounded-xl bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-inter text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
                >
                  <Send size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChatBot
