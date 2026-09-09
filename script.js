import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const scene = new THREE.Scene();
/// Inicio Cienlo
const canvasCielo = document.createElement("canvas");
canvasCielo.width = 2;
canvasCielo.height = 512;
const contexto = canvasCielo.getContext("2d");
const degradado = contexto.createLinearGradient(
0, 0,
0, canvasCielo.height
);
// Parte superior: azul oscuro
degradado.addColorStop(0, "#7480df");
// Parte media: azul grisáceo
degradado.addColorStop(0.5, "#3a536b");
// Parte inferior: tono más claro y natural
degradado.addColorStop(1, "#8fa6b8");
contexto.fillStyle = degradado;
contexto.fillRect(0,0,canvasCielo.width,canvasCielo.height);
const texturaCielo = new THREE.CanvasTexture(canvasCielo);
scene.background = texturaCielo;
// Fin Cielo

//Nubes
const textureLoader = new THREE.TextureLoader();
const texturaNube = textureLoader.load("Imagenes/Nubes.png");
const materialNube = new THREE.MeshBasicMaterial({
    map: texturaNube,
    transparent: true,
    depthWrite: false
});
const nubes = [];
for (let i = 0; i < 80; i++) {
    const nube = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 10),
        materialNube.clone()
    );
    nube.position.set(Math.random() * 350 - 200,80 + Math.random() * 15,Math.random() * 500 - 200);
    // Tamaño diferente para cada nube
    const escala = 0.8 + Math.random() * 1.8;
    nube.scale.set(
        escala,
        escala,
        escala
    );
    scene.add(nube);
    nubes.push({
        mesh: nube,
        velocidad: 0.005 + Math.random() * 0.01
    });
}
//Fin nubes

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(36.21, 33.10, -163.00);
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);
document.body.appendChild(renderer.domElement);
    // ==========================
    // CONTROLES
    // ==========================
    const controls = new OrbitControls(
        camera,
        renderer.domElement
    );
    controls.enableDamping = true;
    controls.enabled = true;
    controls.enableRotate = true;
    // Desactivar zoom con la rueda del mouse
    controls.enableZoom = false;
    // Desactivar desplazamiento lateral
    controls.enablePan = false;
    const posicionInicial = camera.position.clone();
    // Guardar punto inicial hacia donde mira la cámara
    const objetivoInicial = controls.target.clone();

// LUCES
const luzAmbiente = new THREE.AmbientLight(
    0xffffff,
    2
);
scene.add(luzAmbiente);
const luzDireccional = new THREE.DirectionalLight(
    0xffffff,
    3
);
luzDireccional.position.set(10, 15, 10);
scene.add(luzDireccional);
renderer.shadowMap.enabled = true;

// SOL
const geometriaSol = new THREE.SphereGeometry(8,32,32);
const materialSol = new THREE.MeshBasicMaterial({color: 0xffdd66});
const sol = new THREE.Mesh(
geometriaSol,
materialSol
);
// Posición del sol
sol.position.set(112.33,180.29,237.94);
scene.add(sol);

// LUZ DEL SOL
const luzSol = new THREE.DirectionalLight(0xfffff0,0.5);
// Misma posición que el sol
luzSol.position.set(112.33,81.29,237.94);
// Activar sombras
luzSol.castShadow = true;
scene.add(luzSol);

// CARGAR CASA
const loader = new GLTFLoader();
loader.load(
    "Casa_Simon_Oficial.glb",
    function(gltf) {
        const casa = gltf.scene;
casa.position.set(0, 0, 0);
// Activar sombras en todos los objetos de la casa
casa.traverse(function(objeto) {
if (objeto.isMesh) {
    objeto.castShadow = true;
    objeto.receiveShadow = true;
}
});
scene.add(casa);
        console.log("Casa cargada correctamente");
    },
    function(xhr) {
        console.log(
            (xhr.loaded / xhr.total * 100) + "% cargado"
        );
    },
    function(error) {
        console.error(
            "Error al cargar la casa:",
            error
        );
    }
);
window.addEventListener("resize", () => {   
    camera.aspect =
        window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});

const coordenadas = document.getElementById("coordenadas");

// BOTONES
const btnEntorno =
    document.getElementById("btnEntorno");
const btnSalirVista =
    document.getElementById("btnSalirVista");
const presentacion =
    document.getElementById("presentacion");
const botonesPrincipales =
    document.getElementById("botonesPrincipales");
const ayudaMovimiento =
    document.getElementById("ayudaMovimiento");
const btnVerObj =
    document.getElementById("btnObjetos");
const btnSalir =
    document.getElementById("btnSalir");
const btnGaleria =
    document.getElementById("btnGaleria");

// ACTIVAR MODO VISTA
btnEntorno.addEventListener("click", () => {
    // Activar movimiento de cámara
    controls.enabled = true;
    // Ocultar presentación
    presentacion.style.display = "none";
    // Ocultar botones principales
    botonesPrincipales.style.display = "none";
    // Mostrar botón de salir
    btnSalirVista.style.display = "block";
    ayudaMovimiento.style.display = "block";

// SALIR DEL MODO VISTA
btnSalirVista.addEventListener("click", () => {
    // Desactivar controles
    controls.enabled = false;
    // Volver a la posición inicial
    camera.position.copy(posicionInicial);
    // Volver a mirar al punto inicial
    controls.target.copy(objetivoInicial);
    controls.update();
    // Mostrar presentación
    presentacion.style.display = "block";
    // Mostrar botones principales
    botonesPrincipales.style.display = "flex";
    // Ocultar botón salir
    btnSalirVista.style.display = "none";
    ayudaMovimiento.style.display = "none";
    });
    

});

// ACTIVAR MODO VISTA OBJETOS
btnVerObj.addEventListener("click", () => {
    puntoActual = 0;
    progreso = 0;

    // Iniciar recorrido automático
    animandoObjetos = true;
    animandoRegreso = false;

    // Desactivar controles durante el recorrido
    controls.enabled = false;

    // Ocultar presentación
    presentacion.style.display = "none";

    // Ocultar botones principales
    botonesPrincipales.style.display = "none";

    // OCULTAR SALIR mientras la cámara viaja
    btnSalir.style.display = "block";

    ayudaMovimiento.style.display = "none";

// SALIR DEL MODO VISTA OBJETOS
btnSalir.addEventListener("click", () => {
    // Empezar desde el último punto
    puntoActual = caminoObjetos.length - 1;

    // Reiniciar progreso
    progreso = 0;

    // Activar recorrido de regreso
    animandoRegreso = true;

    // Desactivar recorrido de ida
    animandoObjetos = false;

    // Ocultar botón mientras regresa
    btnSalir.style.display = "none";

    ayudaMovimiento.style.display = "none";
    });
    

});

btnGaleria.addEventListener("click", () => {
    window.location.href = "galeria.html";
});

// ==========================
// CAMINO HACIA LOS OBJETOS
const caminoObjetos = [
    // PUNTO 0 - POSICIÓN INICIAL
    {
        posicion: new THREE.Vector3(
            camera.position.x,
            camera.position.y,
            camera.position.z
        ),
        mirar: new THREE.Vector3(20, 8, 0)
    },
    // PUNTO 1
    {
        posicion: new THREE.Vector3(6.66,8.09,-110.67),
        mirar: new THREE.Vector3(0, 0, 0)
    },
    {
        posicion: new THREE.Vector3(6.66,8.09,99),
        mirar: new THREE.Vector3(-150, 0, 150)
    },
    {
        posicion: new THREE.Vector3(-70,8.09,100
        ),
        mirar: new THREE.Vector3(-1000, 0, 0
        ),
         mirarFinal: new THREE.Vector3(-1900, 8, -50
    )
    },

];

let puntoActual = 0;
let progreso = 0;
let velocidad = 0.005;

let animandoObjetos = false;
let animandoRegreso = false;

const btnObjetos = document.getElementById("btnObjetos");


btnObjetos.addEventListener("click", () => {
    // Reiniciar recorrido
    puntoActual = 0;
    progreso = 0;
    // Iniciar recorrido
    animandoObjetos = true;
});

const objetivoMirada = new THREE.Vector3();



//Funcion ANIMATE//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function animate() {
    requestAnimationFrame(animate);
    if (!animandoObjetos && !animandoRegreso) {
    controls.update();
}
    if (camera.position.y < 8) {
    camera.position.y = 8;
    }
    //Animacion nubes
    nubes.forEach((nube) => {
    // Siempre mira hacia la cámara
        nube.mesh.lookAt(camera.position);
        // Movimiento
        nube.mesh.position.x += nube.velocidad;
        // Cuando sale del escenario,
        // vuelve al otro lado
        if (nube.mesh.position.x > 100) {
            nube.mesh.position.x =  -300;
            // Nueva posición aleatoria en Z
            nube.mesh.position.z =
            Math.random() * 200 + 150;
        // Nueva altura aleatoria en Y
            nube.mesh.position.y =
            80 + Math.random() * 15;
        }
    });
    //Fin animacion nubes
    //Coordenadas
    coordenadas.textContent =
        "X: " + camera.position.x.toFixed(2) +
        " | Y: " + camera.position.y.toFixed(2) +
        " | Z: " + camera.position.z.toFixed(2);
    //Fin coordenadas

////////////////////////////////////////////////////////
    if (animandoObjetos) {
    const puntoInicio = caminoObjetos[puntoActual].posicion;
    const puntoFinal = caminoObjetos[puntoActual + 1].posicion;
    progreso += velocidad;
    camera.position.lerpVectors(
        puntoInicio,
        puntoFinal,
        progreso
    );
    // MIRADA
    const mirarHacia = caminoObjetos[puntoActual + 1].mirar;
    camera.lookAt(mirarHacia);
    if (progreso >= 1) {
        progreso = 0;
        puntoActual++;
       if (puntoActual >= caminoObjetos.length - 1) {
    const miradaFinal = caminoObjetos[puntoActual].mirarFinal;
    // Colocar la mirada final
    camera.lookAt(miradaFinal);
    // OrbitControls debe tener el mismo objetivo
    controls.target.copy(miradaFinal);
    // Actualizar controles
    controls.update();
    // Ahora activar los controles
    animandoObjetos = false;
    console.log("Recorrido terminado");
}
    }
}
///////////////////////////////////////////////////////////
    // ==========================================
// RECORRIDO DE REGRESO
// ==========================================

if (animandoRegreso) {

    const puntoInicio =
        caminoObjetos[puntoActual].posicion;

    const puntoFinal =
        caminoObjetos[puntoActual - 1].posicion;

    progreso += velocidad;

    // Mover cámara hacia atrás
    camera.position.lerpVectors(
        puntoInicio,
        puntoFinal,
        progreso
    );

    // Mirar hacia el punto anterior
    const mirarHacia =
        caminoObjetos[puntoActual - 1].mirar;

    camera.lookAt(mirarHacia);

    // Terminó este tramo
    if (progreso >= 1) {

        progreso = 0;

        puntoActual--;

        // ==================================
        // LLEGÓ AL INICIO
        // ==================================

        if (puntoActual <= 0) {

            animandoRegreso = false;

            // Posición inicial exacta
            camera.position.copy(
                caminoObjetos[0].posicion
            );

            // Mirada inicial
            camera.lookAt(
                caminoObjetos[0].mirar
            );

            // Preparar OrbitControls
            controls.target.copy(
                caminoObjetos[0].mirar
            );

            controls.enabled = false;

            // ==================================
            // MOSTRAR INTERFAZ NUEVAMENTE
            // ==================================

            presentacion.style.display = "block";

            botonesPrincipales.style.display = "flex";

            btnSalir.style.display = "none";

            ayudaMovimiento.style.display = "none";

            console.log("Regreso terminado");
        }
    }
}



    renderer.render(scene, camera);
}
animate();