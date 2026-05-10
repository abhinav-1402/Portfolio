import { Canvas } from '@react-three/fiber'
import LoaderScene from './LoaderScene'


function Loader() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1,2]}>
        <LoaderScene />
      </Canvas>
  )
}

export default Loader
