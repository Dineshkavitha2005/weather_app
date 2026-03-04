import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Globe, LogIn, UserPlus, User, LogOut, Settings, X } from 'lucide-react'
import { useWeatherContext } from '../utils/WeatherContext'
import { useLanguage } from '../utils/LanguageContext'
import { useAuth } from '../utils/AuthContext'
import { translations } from '../utils/translations'
import Login from './Login'
import Signup from './Signup'

// Modal Portal Component
const ModalPortal = ({ children }) => {
  return ReactDOM.createPortal(children, document.body)
}

const Header = () => {
  const { isDarkMode, toggleDarkMode } = useWeatherContext()
  const { currentLanguage, changeLanguage } = useLanguage()
  const { user, logout } = useAuth()
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' or 'signup'
  const [showUserMenu, setShowUserMenu] = useState(false)

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ]

  const t = (key) => {
    const keys = key.split('.')
    let value = translations[currentLanguage] || translations.en
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between px-4 sm:px-8 py-6 mb-8 relative z-50"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="flex items-center gap-3"
      >
        <div className="text-4xl">🌤️</div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-poppins">
            {t('appTitle')}
          </h1>
          <p className="text-white/70 text-sm font-inter">
            {t('appSubtitle')}
          </p>
        </div>
      </motion.div>

      <div className="flex items-center gap-3">
        {/* Language Selector */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 dark:bg-slate-700/20 dark:hover:bg-slate-700/30 backdrop-blur-md border border-white/20 dark:border-slate-600/20 transition text-white"
            title="Change language"
          >
            <Globe size={24} />
          </motion.button>

          {/* Language Menu */}
          <AnimatePresence>
            {showLanguageMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 dark:border-slate-700/50 z-50 overflow-hidden"
              >
                <div className="max-h-96 overflow-y-auto">
                  {languages.map((lang) => (
                    <motion.button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code)
                        setShowLanguageMenu(false)
                      }}
                      whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                      className={`w-full px-4 py-3 text-left flex items-center gap-3 transition ${
                        currentLanguage === lang.code
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <div className="flex-1">
                        <p className="font-medium">{lang.name}</p>
                        <p className="text-xs opacity-70">{lang.code.toUpperCase()}</p>
                      </div>
                      {currentLanguage === lang.code && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 rounded-full bg-white flex items-center justify-center"
                        >
                          <span className="text-blue-500 font-bold">✓</span>
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dark Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleDarkMode}
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 dark:bg-slate-700/20 dark:hover:bg-slate-700/30 backdrop-blur-md border border-white/20 dark:border-slate-600/20 transition text-white"
        >
          {isDarkMode ? (
            <Sun size={24} className="text-yellow-300" />
          ) : (
            <Moon size={24} className="text-blue-200" />
          )}
        </motion.button>

        {/* Auth Buttons */}
        {user ? (
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 dark:bg-slate-700/30 dark:hover:bg-slate-700/40 backdrop-blur-md rounded-full border border-white/20 dark:border-slate-600/20 transition text-white"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:block font-medium">{user.name?.split(' ')[0]}</span>
            </motion.button>

            {/* User Menu Dropdown */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 dark:border-slate-700/50 z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        logout()
                        setShowUserMenu(false)
                      }}
                      className="w-full px-4 py-3 text-left flex items-center gap-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                    >
                      <LogOut size={20} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setAuthMode('login')
                setShowAuthModal(true)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 dark:bg-slate-700/30 dark:hover:bg-slate-700/40 backdrop-blur-md rounded-full border border-white/20 dark:border-slate-600/20 transition text-white font-medium"
            >
              <LogIn size={18} />
              <span className="hidden sm:block">Login</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setAuthMode('signup')
                setShowAuthModal(true)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full text-white font-medium shadow-lg shadow-blue-500/25 transition"
            >
              <UserPlus size={18} />
              <span className="hidden sm:block">Sign Up</span>
            </motion.button>
          </div>
        )}
      </div>

      {/* Auth Modal - Using Portal to render outside header */}
      <ModalPortal>
        <AnimatePresence>
          {showAuthModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) setShowAuthModal(false)
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition z-10"
                >
                  <X size={24} />
                </button>
                {authMode === 'login' ? (
                  <Login
                    onSwitchToSignup={() => setAuthMode('signup')}
                    onClose={() => setShowAuthModal(false)}
                  />
                ) : (
                  <Signup
                    onSwitchToLogin={() => setAuthMode('login')}
                    onClose={() => setShowAuthModal(false)}
                  />
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </ModalPortal>
    </motion.header>
  )
}

export default Header
