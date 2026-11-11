import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { ProductMannequinModel3dDto } from "@/lib/product-3d-api";

function disposeObject(root: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();

  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    geometries.add(object.geometry);
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      materials.add(material);
      for (const value of Object.values(material)) {
        if (value instanceof THREE.Texture) textures.add(value);
      }
    }
  });
  textures.forEach((texture) => texture.dispose());
  materials.forEach((material) => material.dispose());
  geometries.forEach((geometry) => geometry.dispose());
}

export default function CollectionRackScene({
  models,
  active,
  visible,
}: {
  models: Array<ProductMannequinModel3dDto & { garment?: "tee" | "trousers" }>;
  active: number;
  visible: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const selected = useRef(active);
  const onscreen = useRef(visible);
  const invalidate = useRef<() => void>(() => {});

  useEffect(() => {
    selected.current = active;
    onscreen.current = visible;
    invalidate.current();
  }, [active, visible]);

  useEffect(() => {
    const element = host.current;
    const target = element?.parentElement;
    if (
      !element ||
      !target ||
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    )
      return;

    let disposed = false;
    let releaseScene: (() => void) | undefined;

    const start = async () => {
      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "low-power" });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(getComputedStyle(target).backgroundColor);
      Object.assign(renderer.domElement.style, { display: "block", width: "100%", height: "100%" });

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-3, 3, 1.7, -1.7, 0.1, 30);
      camera.position.set(0, 0, 8);
      scene.add(new THREE.HemisphereLight(0xffffff, 0x746a62, 2));
      const light = new THREE.DirectionalLight(0xffffff, 2.3);
      light.position.set(2, 5, 4);
      scene.add(light);

      const metal = new THREE.MeshStandardMaterial({
        color: 0x767676,
        metalness: 0.35,
        roughness: 0.36,
      });
      const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 1, 16), metal);
      rail.rotation.z = Math.PI / 2;
      scene.add(rail);

      const pivots = models.map(({ garment }) => {
        const pivot = new THREE.Group();
        const hook = new THREE.Mesh(
          new THREE.TorusGeometry(0.065, 0.013, 8, 24, Math.PI * 1.65),
          metal,
        );
        hook.rotation.z = -Math.PI / 4;
        const hanger = new THREE.Group();
        hanger.add(hook);
        const bar = (from: THREE.Vector3, to: THREE.Vector3) => {
          const mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(0.014, 0.014, from.distanceTo(to), 8),
            metal,
          );
          mesh.position.copy(from).lerp(to, 0.5);
          mesh.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            to.clone().sub(from).normalize(),
          );
          hanger.add(mesh);
        };
        if (garment === "trousers") {
          bar(new THREE.Vector3(0, -0.06, 0), new THREE.Vector3(0, -0.12, 0));
          bar(new THREE.Vector3(-0.25, -0.12, 0), new THREE.Vector3(0.25, -0.12, 0));
          for (const x of [-0.19, 0.19]) {
            const clip = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.095, 0.055), metal);
            clip.position.set(x, -0.15, 0);
            hanger.add(clip);
          }
        } else if (garment === "tee") {
          for (const x of [-0.33, 0.33]) {
            bar(new THREE.Vector3(0, -0.08, 0), new THREE.Vector3(x, -0.22, 0));
          }
        }
        pivot.add(hanger);
        scene.add(pivot);
        return pivot;
      });

      let frame = 0;
      let ready = false;
      let drag: { id: number; x: number; angle: number } | null = null;
      let angle = 0;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

      function draw() {
        frame = 0;
        if (!ready || disposed || !onscreen.current) return;

        let moving = false;
        pivots.forEach((pivot, index) => {
          const isSelected = index === selected.current;
          const desired = isSelected ? angle : 0.92;
          const delta = desired - pivot.rotation.y;
          pivot.rotation.y +=
            reducedMotion.matches || Math.abs(delta) < 0.001 ? delta : delta * 0.18;
          const sway = reducedMotion.matches ? 0 : Math.max(-0.1, Math.min(0.1, delta * 0.11));
          pivot.rotation.z += (sway - pivot.rotation.z) * (reducedMotion.matches ? 1 : 0.13);
          moving ||= Math.abs(delta) > 0.001 || Math.abs(pivot.rotation.z) > 0.002;
        });
        renderer.render(scene, camera);
        if (moving) requestDraw();
      }

      function requestDraw() {
        if (!frame && ready && onscreen.current) frame = requestAnimationFrame(draw);
      }

      let previousSelection = selected.current;
      invalidate.current = () => {
        if (previousSelection !== selected.current) {
          previousSelection = selected.current;
          angle = 0;
        }
        requestDraw();
      };

      const resize = new ResizeObserver(() => {
        const width = Math.max(1, element.clientWidth);
        const height = Math.max(1, element.clientHeight);
        const halfWidth = (width / height) * 1.7;
        camera.left = -halfWidth;
        camera.right = halfWidth;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
        rail.position.y = 1.29;
        rail.scale.y = halfWidth * 1.84;
        pivots.forEach((pivot, index) => {
          pivot.position.set(halfWidth * 1.72 * ((index + 0.5) / pivots.length - 0.5), 1.29, 0);
          const garment = pivot.children[1];
          if (garment) {
            const maxWidth = (halfWidth * 1.55) / pivots.length;
            const fit = Math.min(1, maxWidth / garment.userData.width);
            garment.scale.setScalar(garment.userData.fit * fit);
          }
        });
        requestDraw();
      });

      const down = (event: PointerEvent) => {
        if (!ready || !event.isPrimary || event.button !== 0) return;
        drag = { id: event.pointerId, x: event.clientX, angle };
      };
      const move = (event: PointerEvent) => {
        if (!drag || drag.id !== event.pointerId) return;
        angle = drag.angle + (event.clientX - drag.x) * 0.012;
        requestDraw();
      };
      const up = (event: PointerEvent) => {
        if (drag?.id === event.pointerId) drag = null;
      };
      const onLoss = (event: Event) => {
        event.preventDefault();
        ready = false;
        renderer.domElement.remove();
      };

      releaseScene = () => {
        ready = false;
        cancelAnimationFrame(frame);
        resize.disconnect();
        target.removeEventListener("pointerdown", down);
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", up);
        renderer.domElement.removeEventListener("webglcontextlost", onLoss);
        renderer.domElement.remove();
        disposeObject(scene);
        renderer.dispose();
        invalidate.current = () => {};
      };

      const loader = new GLTFLoader();
      const results = await Promise.allSettled(models.map((model) => loader.loadAsync(model.url)));
      const roots = results.flatMap((result) =>
        result.status === "fulfilled" ? [result.value.scene] : [],
      );
      if (disposed || roots.length !== pivots.length) {
        roots.forEach(disposeObject);
        releaseScene?.();
        releaseScene = undefined;
        return;
      }

      roots.forEach((root, index) => {
        const box = new THREE.Box3().setFromObject(root);
        const size = box.getSize(new THREE.Vector3());
        const fit = (models[index].garment === "tee" ? 1.57 : 2.38) / Math.max(0.001, size.y);
        const center = box.getCenter(new THREE.Vector3());
        root.position.sub(new THREE.Vector3(center.x, box.max.y, center.z));
        const garment = new THREE.Group();
        garment.position.y = -0.14;
        garment.scale.setScalar(fit);
        garment.userData = { width: Math.max(0.001, size.x * fit), fit };
        garment.add(root);
        pivots[index].add(garment);
      });

      renderer.domElement.addEventListener("webglcontextlost", onLoss);
      target.addEventListener("pointerdown", down);
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", up);
      element.appendChild(renderer.domElement);
      ready = true;
      resize.observe(element);
    };

    void start().catch(() => releaseScene?.());

    return () => {
      disposed = true;
      releaseScene?.();
      releaseScene = undefined;
    };
  }, [models]);

  return (
    <div
      ref={host}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
