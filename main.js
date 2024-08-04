import * as THREE from 'three'
import gsap from 'gsap'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

//textures
const textureLoader = new THREE.TextureLoader()
const earthTexture = textureLoader.load('/assets/earthmap.jpg')
earthTexture.colorSpace = THREE.SRGBColorSpace
earthTexture.magFilter = THREE.NearestFilter

//canvas
const canvas = document.querySelector('#my-canvas')

//scene
const scene = new THREE.Scene()

//sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//earth
const earthMesh = new THREE.Mesh(
  new THREE.SphereGeometry(1, 30, 30),
  new THREE.MeshBasicMaterial({ map: earthTexture })
)
scene.add(earthMesh)

//text 
const loader = new FontLoader();
loader.load('assets/helvetiker_regular.typeface.json', (font) => {
  const textGeometry = new TextGeometry('Hello World !',
    {
      font: font,
      size: 0.3,
      depth: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.0001,
      bevelSize: 0.0001,
      bevelOffset: 0,
      bevelSegments: 5
    }
  )
  const textMaterial = new THREE.MeshBasicMaterial({ color: '#e2e2e2' })
  const text = new THREE.Mesh(textGeometry, textMaterial)
  text.position.z = 1
  text.position.x=-1.1

  scene.add(text)

  var tl = gsap.timeline({ repeat: -1, ease: 'none' })
});


//camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height)
camera.position.z = 8
camera.lookAt(earthMesh.position)
scene.add(camera)

//controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//axis helper
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)


//renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new THREE.Clock()

gsap.to(earthMesh.rotation, { duration: 10, y: earthMesh.rotation.y + Math.PI * 2, repeat: -1, ease: 'none' })


const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()