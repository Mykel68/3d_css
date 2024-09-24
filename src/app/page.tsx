"use client"

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { ChromePicker, ColorResult } from 'react-color'
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Bell, Sun, Moon, Zap } from 'lucide-react'
import * as THREE from 'three'

interface CubeProps {
  isDarkMode: boolean;
  cubeColor: string;
  onTap: () => void;
}

function Cube({ cubeColor, onTap }: CubeProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2
      meshRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <mesh ref={meshRef} onClick={onTap}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={cubeColor} />
    </mesh>
  )
}

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [text, setText] = useState<string>('')
  const [cubeColor, setCubeColor] = useState<string>("#818CF8")
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false)
  const colorPickerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const fullText = "CSS & 3D are awesome!"
    let i = 0
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.slice(0, i + 1))
        i++
      } else {
        clearInterval(typingInterval)
      }
    }, 100)

    return () => clearInterval(typingInterval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = oldProgress + 1
        return newProgress > 100 ? 0 : newProgress
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  const handleCubeTap = () => {
    setShowColorPicker(prev => !prev);

  };

  return (
    <Card className={`w-screen max-w-md mx-auto p-6 h-screen overflow-hidden rounded-xl shadow-lg transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">3D Interactive Demo</h2>
        <Switch
          checked={isDarkMode}
          onCheckedChange={(value) => {
            setIsDarkMode(value)

          }}
          className="ml-4"
        />
        {isDarkMode ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
      </div>

      <div className="relative h-64 mb-6">
        <Canvas>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <Cube isDarkMode={isDarkMode} cubeColor={cubeColor} onTap={handleCubeTap} />
          <OrbitControls enableZoom={false} />
        </Canvas>

        {showColorPicker && (
          <div ref={colorPickerRef} className="absolute top-40 left-0 z-10">
            <ChromePicker
              color={cubeColor}
              onChangeComplete={(color: ColorResult) => setCubeColor(color.hex)}
              disableAlpha
            />
          </div>
        )}
      </div>



      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          className={`p-4 rounded-lg cursor-pointer ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}

        >
          Hover me!
        </motion.div>
        <motion.div
          className={`p-4 rounded-lg cursor-pointer ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          whileHover={{ rotate: 5 }}
          whileTap={{ rotate: -5 }}

        >
          Tilt me!
        </motion.div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
        </div>
        <div className="w-3/4 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <motion.div
        className={`relative overflow-hidden p-4 rounded-lg mb-6 ${isDarkMode ? 'bg-indigo-600' : 'bg-indigo-100'}`}
      >
        <Zap className="w-6 h-6 mx-auto" />

      </motion.div>

      <div className="text-center text-xl font-bold">
        {text}
        <span className="animate-pulse">|</span>
      </div>
    </Card>
  )
}
