import React from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { process24HourForecast } from '../utils/helpers'

const HourlyChart = ({ forecastData }) => {
  if (!forecastData || !forecastData.list) return null

  const data = process24HourForecast(forecastData)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/60 dark:bg-slate-700/60 backdrop-blur-lg rounded-3xl p-6 mb-6 shadow-xl border border-white/20 dark:border-slate-600/20"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-poppins">
        24-Hour Temperature Trend
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 200, 200, 0.2)" />
          <XAxis
            dataKey="time"
            formatter={(value) => `${value}:00`}
            stroke="currentColor"
            className="text-gray-600 dark:text-gray-400"
          />
          <YAxis
            stroke="currentColor"
            className="text-gray-600 dark:text-gray-400"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: 'none',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)'
            }}
            labelStyle={{ color: '#000' }}
            formatter={(value) => [`${value}°`, 'Temperature']}
            labelFormatter={(label) => `${label}:00`}
          />
          <Line
            type="monotone"
            dataKey="temp"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorTemp)"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Hourly Details */}
      <div className="mt-6 grid grid-cols-4 sm:grid-cols-8 gap-2">
        {data.map((hour, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-blue-400/20 to-cyan-400/20 dark:from-blue-500/20 dark:to-cyan-500/20 rounded-lg p-2 text-center backdrop-blur"
          >
            <p className="text-xs text-gray-600 dark:text-gray-400 font-inter">
              {hour.time}:00
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {hour.temp}°
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {hour.humidity}%
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default HourlyChart
