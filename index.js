// import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/97/three.module.js'

const el = document.querySelector('#app')
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  // 3,
  75,
  el.clientWidth / el.clientHeight,
  0.1,
  1000
)
// var controls = new THREE.OrbitControls(camera)
scene.add(camera)
const gl = new THREE.GLTFLoader()

// can guriguri camera
// const controls = new THREE.OrbitControls(camera)

const renderer = new THREE.WebGLRenderer({
  alpha: true
})
renderer.setSize(el.clientWidth, el.clientHeight)
el.appendChild(renderer.domElement)

const startTime = +new Date()
const uniforms = {
  time: { type: 'float', value: 0 }
}

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
scene.add(directionalLight)
directionalLight.rotation.set(45, 135, 0)
const ambient = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambient)
// const uri = `https://s3-ap-northeast-1.amazonaws.com/test-upload-contents/${location.hash.slice(
//   1
// )}`

let object

// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
// object = new THREE.Mesh(geometry, material)
// scene.add(object)

const uri = './model/ken-hamburger/hamburger.glb'
gl.load(uri, data => {
  const gltf = data
  object = gltf.scene
  object.scale.x = 0.7
  object.scale.y = 0.7
  object.scale.z = 0.7
  scene.add(object)
})

camera.position.z = 5

const doc = new THREE.DeviceOrientationControls(camera)
doc.connect()

const animate = () => {
  // cube.rotation.x += 0.01
  // cube.rotation.y += 0.01

  const elapsedTime = +new Date() - startTime
  uniforms.time.value = elapsedTime / 1000

  // controls.update()
  doc.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

animate()

// const video = document.querySelector('#video')

// const media = navigator.mediaDevices.getUserMedia({
//   video: {
//     facingMode: 'environment'
//   },
//   audio: false
// })

// media.then(stream => {
//   video.srcObject = stream
// })

let touchX = null
let touchY = null

let baseTheta = 0
let basePhi = 0
theta = 0
phi = 0

const touchStart = e => {
  const t = (e.touches && e.touches[0]) || e
  baseTheta = theta
  basePhi = phi
  touchX = t.pageX
  touchY = t.pageY
}

const sensitivity = 0.01

const touchMove = e => {
  if (!touchX || !touchY) return
  const t = (e.touches && e.touches[0]) || e
  const deltaX = (touchX - t.pageX) * sensitivity
  const deltaY = (touchY - t.pageY) * sensitivity
  theta = Math.min(Math.max(baseTheta + deltaY, -90), 90)
  phi = (basePhi + deltaX) % 360
  // console.log(deltaX, deltaY)
  // console.log(theta, phi)
  const r = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(theta * -1, phi * -1, 0)
  )
  object.setRotationFromQuaternion(r)
}

const touchEnd = e => {
  touchX = null
  touchY = null
}

document.addEventListener('touchstart', touchStart)
document.addEventListener('mousedown', touchStart)

document.addEventListener('touchmove', touchMove)
document.addEventListener('mousemove', touchMove)

document.addEventListener('touchend', touchStart)
document.addEventListener('mouseup', touchEnd)
