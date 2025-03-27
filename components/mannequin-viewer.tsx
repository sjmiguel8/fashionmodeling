"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import type { ClothingItem } from "@/lib/types"

interface MannequinViewerProps {
  bodyShape: {
    height: number
    shoulders: number
    chest: number
    waist: number
    hips: number
  }
  selectedItems: {
    top: ClothingItem | null
    bottom: ClothingItem | null
    dress: ClothingItem | null
    outerwear: ClothingItem | null
  }
}

export function MannequinViewer({ bodyShape, selectedItems }: MannequinViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const mannequinRef = useRef<THREE.Group | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return

    // Create scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf5f5f5)
    sceneRef.current = scene

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.set(0, 1, 3)
    cameraRef.current = camera

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 10, 7.5)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.minDistance = 1.5
    controls.maxDistance = 5
    controls.maxPolarAngle = Math.PI / 2
    controlsRef.current = controls

    // Load mannequin model (placeholder)
    const geometry = new THREE.CylinderGeometry(0.3, 0.2, 1.8, 32)
    const material = new THREE.MeshStandardMaterial({ color: 0xdddddd })
    const mannequin = new THREE.Mesh(geometry, material)
    mannequin.position.y = 0.9
    mannequin.castShadow = true
    mannequin.receiveShadow = true
    scene.add(mannequin)

    // Add floor
    const floorGeometry = new THREE.CircleGeometry(2, 32)
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return

      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight

      cameraRef.current.aspect = width / height
      cameraRef.current.updateProjectionMatrix()

      rendererRef.current.setSize(width, height)
    }
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
      rendererRef.current?.dispose()
    }
  }, [])

  // Update mannequin based on body shape
  useEffect(() => {
    if (!sceneRef.current || !mannequinRef.current) return

    // In a real implementation, we would update the 3D model's morphTargets or
    // scale different parts of the model based on the bodyShape values

    // For this demo, we'll just log the changes
    console.log("Body shape updated:", bodyShape)
  }, [bodyShape])

  // Update clothing on mannequin
  useEffect(() => {
    if (!sceneRef.current || !mannequinRef.current) return

    // In a real implementation, we would load 3D models for each clothing item
    // and attach them to the mannequin

    // For this demo, we'll just log the changes
    console.log("Selected items updated:", selectedItems)
  }, [selectedItems])

  return <div ref={containerRef} className="w-full h-full" />
}

