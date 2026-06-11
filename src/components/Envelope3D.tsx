import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { useRef, useState, useEffect, Suspense } from "react";
import * as THREE from "three";

type Stage = "sealed" | "cracking" | "flap" | "card" | "done";

const PAPER = "#f4ead5";
const PAPER_DARK = "#e0d3b0";
const WAX = "#7a1f2b";
const GOLD = "#d4af37";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function Envelope({ stage, onAdvance, onDone }: {
  stage: Stage;
  onAdvance: (s: Stage) => void;
  onDone: () => void;
}) {
  const flapRef = useRef<THREE.Group>(null);
  const sealLeft = useRef<THREE.Mesh>(null);
  const sealRight = useRef<THREE.Mesh>(null);
  const cardRef = useRef<THREE.Group>(null);
  const cardInnerRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered && stage === "sealed" ? "pointer" : "auto";
    return () => { document.body.style.cursor = "auto"; };
  }, [hovered, stage]);

  // stage timeline
  useEffect(() => {
    if (stage === "cracking") {
      const t = setTimeout(() => onAdvance("flap"), 900);
      return () => clearTimeout(t);
    }
    if (stage === "flap") {
      const t = setTimeout(() => onAdvance("card"), 1400);
      return () => clearTimeout(t);
    }
    if (stage === "card") {
      const t = setTimeout(() => { onAdvance("done"); onDone(); }, 2200);
      return () => clearTimeout(t);
    }
  }, [stage, onAdvance, onDone]);

  useFrame((_, delta) => {
    const k = 1 - Math.pow(0.001, delta);

    // Envelope drift
    if (groupRef.current) {
      const targetY = stage === "done" ? 0.6 : 0;
      groupRef.current.position.y = lerp(groupRef.current.position.y, targetY, k * 0.6);
      groupRef.current.rotation.y += delta * 0.05;
    }

    // Flap rotation
    if (flapRef.current) {
      const target = stage === "flap" || stage === "card" || stage === "done" ? Math.PI * 0.95 : 0;
      flapRef.current.rotation.x = lerp(flapRef.current.rotation.x, target, k * 0.7);
    }

    // Seal crack: split halves
    if (sealLeft.current && sealRight.current) {
      const opened = stage !== "sealed";
      const targetX = opened ? -0.35 : 0;
      const targetRot = opened ? -0.6 : 0;
      const targetOp = stage === "card" || stage === "done" ? 0 : opened ? 0.9 : 1;
      sealLeft.current.position.x = lerp(sealLeft.current.position.x, targetX, k * 0.6);
      sealRight.current.position.x = lerp(sealRight.current.position.x, -targetX, k * 0.6);
      sealLeft.current.rotation.z = lerp(sealLeft.current.rotation.z, targetRot, k * 0.6);
      sealRight.current.rotation.z = lerp(sealRight.current.rotation.z, -targetRot, k * 0.6);
      const mat1 = sealLeft.current.material as THREE.MeshStandardMaterial;
      const mat2 = sealRight.current.material as THREE.MeshStandardMaterial;
      mat1.opacity = lerp(mat1.opacity, targetOp, k * 0.5);
      mat2.opacity = lerp(mat2.opacity, targetOp, k * 0.5);
    }

    // Card slide out + tilt up
    if (cardRef.current) {
      const out = stage === "card" || stage === "done";
      const targetY = out ? 1.6 : -0.1;
      const targetZ = out ? 0.4 : 0.05;
      const targetRotX = out ? -0.35 : 0;
      cardRef.current.position.y = lerp(cardRef.current.position.y, targetY, k * 0.5);
      cardRef.current.position.z = lerp(cardRef.current.position.z, targetZ, k * 0.5);
      cardRef.current.rotation.x = lerp(cardRef.current.rotation.x, targetRotX, k * 0.5);
    }
    if (cardInnerRef.current) {
      const visible = stage === "card" || stage === "done";
      cardInnerRef.current.scale.y = lerp(cardInnerRef.current.scale.y, visible ? 1 : 0.001, k * 0.5);
    }
  });

  const onSealClick = (e: any) => {
    e.stopPropagation();
    if (stage === "sealed") onAdvance("cracking");
  };

  return (
    <group ref={groupRef} position={[0, -0.3, 0]} rotation={[-0.15, 0, 0]}>
      {/* Envelope back */}
      <mesh position={[0, 0, -0.02]} receiveShadow>
        <boxGeometry args={[3.2, 2.1, 0.04]} />
        <meshStandardMaterial color={PAPER_DARK} roughness={0.9} />
      </mesh>

      {/* Card inside */}
      <group ref={cardRef} position={[0, -0.1, 0.05]}>
        <mesh castShadow>
          <boxGeometry args={[3.0, 1.95, 0.03]} />
          <meshStandardMaterial color={PAPER} roughness={0.7} />
        </mesh>
        <group ref={cardInnerRef} position={[0, 0, 0.02]}>
          {/* Gold ornamental border */}
          <mesh>
            <ringGeometry args={[0.55, 0.6, 64]} />
            <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.25} emissive={GOLD} emissiveIntensity={0.15} />
          </mesh>
          <mesh>
            <ringGeometry args={[0.38, 0.42, 8]} />
            <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.25} />
          </mesh>
          {/* Border frame */}
          <mesh position={[0, 0, -0.001]}>
            <ringGeometry args={[1.25, 1.28, 4, 1]} />
            <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.3} side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>

      {/* Envelope side flaps (closed look) */}
      <mesh position={[-1.05, 0, 0.01]}>
        <planeGeometry args={[1.1, 2.1]} />
        <meshStandardMaterial color={PAPER_DARK} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[1.05, 0, 0.01]}>
        <planeGeometry args={[1.1, 2.1]} />
        <meshStandardMaterial color={PAPER_DARK} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* Bottom flap */}
      <mesh position={[0, -0.55, 0.02]}>
        <planeGeometry args={[3.2, 1.0]} />
        <meshStandardMaterial color={PAPER_DARK} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* Top flap (opens) — pivot at top edge */}
      <group position={[0, 1.05, 0.03]}>
        <group ref={flapRef}>
          <mesh position={[0, -0.55, 0]} castShadow
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          >
            {/* triangular flap approximated as shape */}
            <shapeGeometry args={[(() => {
              const s = new THREE.Shape();
              s.moveTo(-1.6, 0.55);
              s.lineTo(1.6, 0.55);
              s.lineTo(0, -0.55);
              s.lineTo(-1.6, 0.55);
              return s;
            })()]} />
            <meshStandardMaterial color={PAPER_DARK} roughness={0.85} side={THREE.DoubleSide} />
          </mesh>

          {/* Wax seal — two halves */}
          <group position={[0, -0.9, 0.04]} onClick={onSealClick}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          >
            <mesh ref={sealLeft} castShadow>
              <cylinderGeometry args={[0.22, 0.22, 0.06, 32, 1, false, Math.PI / 2, Math.PI]} />
              <meshStandardMaterial color={WAX} roughness={0.45} metalness={0.1} transparent opacity={1} />
            </mesh>
            <mesh ref={sealRight} castShadow>
              <cylinderGeometry args={[0.22, 0.22, 0.06, 32, 1, false, -Math.PI / 2, Math.PI]} />
              <meshStandardMaterial color={WAX} roughness={0.45} metalness={0.1} transparent opacity={1} />
            </mesh>
            {/* Gold monogram on seal */}
            <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.11, 0.14, 8]} />
              <meshStandardMaterial color={GOLD} metalness={1} roughness={0.2} emissive={GOLD} emissiveIntensity={0.2} />
            </mesh>
          </group>
        </group>
      </group>

      {/* Front monogram on envelope */}
      <mesh position={[0, -0.2, 0.025]}>
        <ringGeometry args={[0.18, 0.21, 32]} />
        <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  );
}

export function Envelope3D({ onOpened }: { onOpened: () => void }) {
  const [stage, setStage] = useState<Stage>("sealed");

  return (
    <div className="relative w-full h-screen bg-emerald-deep overflow-hidden">
      {/* Ambient ornament */}
      <div className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 50%, oklch(0.62 0.13 70 / 0.4), transparent 60%)",
        }}
      />

      <Canvas shadows camera={{ position: [0, 0.3, 5], fov: 38 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.45} />
          <directionalLight position={[3, 5, 4]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
          <pointLight position={[-3, 2, 3]} intensity={0.6} color="#d4af37" />
          <Environment preset="apartment" />
          <Envelope stage={stage} onAdvance={setStage} onDone={onOpened} />
          <ContactShadows position={[0, -1.6, 0]} opacity={0.5} scale={8} blur={2.5} far={3} />
        </Suspense>
      </Canvas>

      {/* Prompt overlay */}
      <div className="pointer-events-none absolute bottom-12 inset-x-0 flex flex-col items-center gap-3 text-center px-6">
        {stage === "sealed" && (
          <>
            <div className="ornamental-divider w-full max-w-xs">
              <span className="font-arabic text-2xl">۞</span>
            </div>
            <p className="text-gold font-display tracking-[0.3em] text-sm uppercase animate-shimmer">
              Press the Wax Seal to Open
            </p>
            <p className="font-serif italic text-cream/60 text-sm">An invitation awaits</p>
          </>
        )}
        {stage !== "sealed" && stage !== "done" && (
          <p className="text-gold/80 font-display tracking-[0.3em] text-xs uppercase">Opening…</p>
        )}
      </div>
    </div>
  );
}
