import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function ProductModel3dViewer({
  modelUrl,
  productName,
  onError,
}: {
  modelUrl: string;
  productName: string;
  onError: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const resetViewRef = useRef<(() => void) | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let failed = false;
    let loadedRoot: THREE.Object3D | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const fail = () => {
      if (failed || disposed) return;
      failed = true;
      onError();
    };

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      fail();
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.domElement.className = "h-full w-full touch-none";
    renderer.domElement.setAttribute("aria-label", `مدل سه‌بعدی ${productName}`);
    renderer.domElement.setAttribute("role", "img");
    host.appendChild(renderer.domElement);

    const onContextLost = (event: Event) => {
      event.preventDefault();
      fail();
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 1000);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = false;
    controls.rotateSpeed = 0.7;
    controls.zoomSpeed = 0.8;
    controls.minPolarAngle = Math.PI * 0.08;
    controls.maxPolarAngle = Math.PI * 0.92;

    const hemisphere = new THREE.HemisphereLight(0xffffff, 0x5c6470, 2.2);
    scene.add(hemisphere);
    const key = new THREE.DirectionalLight(0xffffff, 3.2);
    key.position.set(4, 6, 7);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 1.3);
    fill.position.set(-5, 2, 4);
    scene.add(fill);

    const render = () => renderer.render(scene, camera);
    controls.addEventListener("change", render);

    const sizeRenderer = () => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      render();
    };

    resizeObserver = new ResizeObserver(sizeRenderer);
    resizeObserver.observe(host);
    sizeRenderer();

    const disposeRoot = (root: THREE.Object3D) => {
      root.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose?.();

        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : mesh.material
            ? [mesh.material]
            : [];

        materials.forEach((material) => {
          Object.values(material).forEach((value) => {
            if (value instanceof THREE.Texture) value.dispose();
          });
          material.dispose();
        });
      });
    };

    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        if (disposed) {
          disposeRoot(gltf.scene);
          return;
        }

        const root = gltf.scene;
        const box = new THREE.Box3().setFromObject(root);
        const dimensions = box.getSize(new THREE.Vector3());
        const maxDimension = Math.max(dimensions.x, dimensions.y, dimensions.z);

        if (!Number.isFinite(maxDimension) || maxDimension <= 0) {
          disposeRoot(root);
          fail();
          return;
        }

        const center = box.getCenter(new THREE.Vector3());
        root.position.sub(center);
        scene.add(root);
        loadedRoot = root;

        const halfFov = THREE.MathUtils.degToRad(camera.fov * 0.5);
        const distance = (maxDimension * 0.5) / Math.tan(halfFov) * 1.45;
        const setInitialView = () => {
          camera.near = Math.max(distance / 100, 0.01);
          camera.far = Math.max(distance * 30, 100);
          camera.position.set(distance * 0.16, maxDimension * 0.05, distance);
          camera.updateProjectionMatrix();
          controls.target.set(0, 0, 0);
          controls.minDistance = distance * 0.55;
          controls.maxDistance = distance * 2.5;
          controls.update();
          render();
        };

        resetViewRef.current = setInitialView;
        setInitialView();
        setReady(true);
      },
      undefined,
      () => fail(),
    );

    return () => {
      disposed = true;
      resetViewRef.current = null;
      resizeObserver?.disconnect();
      controls.removeEventListener("change", render);
      controls.dispose();
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost, false);

      if (loadedRoot) {
        scene.remove(loadedRoot);
        disposeRoot(loadedRoot);
      }

      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [modelUrl, onError, productName]);

  return (
    <div className="relative h-full w-full bg-[#f3f1ec]" dir="rtl">
      <div ref={hostRef} className="absolute inset-0" />
      {!ready ? (
        <div
          className="pointer-events-none absolute inset-0 grid place-items-center bg-[#f3f1ec] text-center"
          aria-live="polite"
        >
          <div>
            <span className="mx-auto block h-8 w-8 animate-spin rounded-full border-2 border-obsidian/20 border-t-obsidian" />
            <p className="mt-3 text-xs font-bold text-obsidian">در حال آماده‌سازی نمای سه‌بعدی…</p>
          </div>
        </div>
      ) : (
        <>
          <p className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-obsidian/80 px-3 py-1.5 text-[11px] font-bold text-bone shadow-lg">
            بکشید: چرخش · اسکرول: زوم
          </p>
          <button
            type="button"
            onClick={() => resetViewRef.current?.()}
            className="tap-target absolute left-4 top-4 rounded-full border border-obsidian/15 bg-white/90 px-3 py-2 text-[11px] font-black text-obsidian shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            بازنشانی نما
          </button>
        </>
      )}
    </div>
  );
}
