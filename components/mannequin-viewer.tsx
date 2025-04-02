"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
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
      1000
    )
    camera.position.set(0, 1.5, 2.5)
    cameraRef.current = camera

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Setup lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5)
    fillLight.position.set(-5, 3, -5)
    scene.add(fillLight)

    // Add floor
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(2, 32),
      new THREE.MeshStandardMaterial({ color: 0xeeeeee })
    )
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)

    // Setup controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.minDistance = 1
    controls.maxDistance = 10
    controls.maxPolarAngle = Math.PI / 2
    controls.target.set(0, 1, 0)
    controlsRef.current = controls

    // Load mannequin model
    const loader = new GLTFLoader()
    loader.load(
      '/models/doll-mannequin-made-with-ia/source/mani-doll.glb', // Note: Keep spaces if that's the actual filename
      (gltf) => {
        const model = gltf.scene
        
        // Apply materials and shadows
        model.traverse((node: THREE.Object3D) => {
          if (node instanceof THREE.Mesh) {
            node.castShadow = true
            node.receiveShadow = true
          }
        })

        // Position and scale the model
        model.scale.set(1, 1, 1)
        model.position.y = 0
        model.rotation.y = Math.PI

        // Remove placeholder if it exists
        if (mannequinRef.current) {
          scene.remove(mannequinRef.current)
        }
        
        // Set new model
        mannequinRef.current = model
        scene.add(model)

        // Center camera on model
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())

        const maxDim = Math.max(size.x, size.y, size.z)
        camera.position.set(center.x, center.y + size.y/2, center.z + maxDim * 2)
        camera.lookAt(center)

        // Update controls target
        controls.target.copy(center)
        controls.update()
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%')
      },
      (error) => {
        console.error('Error loading mannequin:', error)
      }
    )

    // Animation loop
    function animate() {
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
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
      rendererRef.current?.dispose()
    }
  }, [])

  // Update mannequin scale with smoother transitions
  useEffect(() => {
    if (!mannequinRef.current) return

    const model = mannequinRef.current
    const scaleX = 0.9 + (bodyShape.shoulders / 100) * 0.2
    const scaleY = 0.9 + (bodyShape.height / 100) * 0.2
    const scaleZ = 0.9 + (bodyShape.chest / 100) * 0.2

    // Smooth transition
    const duration = 500 // milliseconds
    const startScale = { x: model.scale.x, y: model.scale.y, z: model.scale.z }
    const targetScale = { x: scaleX, y: scaleY, z: scaleZ }
    const startTime = Date.now()

    function updateScale() {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Smooth easing function
      const easeProgress = progress * (2 - progress)
      
      model.scale.x = startScale.x + (targetScale.x - startScale.x) * easeProgress
      model.scale.y = startScale.y + (targetScale.y - startScale.y) * easeProgress
      model.scale.z = startScale.z + (targetScale.z - startScale.z) * easeProgress

      if (progress < 1) {
        requestAnimationFrame(updateScale)
      }
    }

    updateScale()
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

