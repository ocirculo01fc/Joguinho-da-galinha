//constantes
const n = Math.floor(Math.random() * 10)
const maxX = 565
const maxY = 365

const m = document.getElementById("menu");
const j = document.getElementById("mapa");
const o = document.getElementById("o")
const c = document.getElementById("c")
const personagem = document.getElementById("personagem")
const mapa = document.getElementById("mapa")

//estado
let oC = 12
let coins = 5
let coletadoO = false
let onde = "";

let casas = [
  {
    tipo: "loja",
    x: 100,
    y: 100
  }
]
let player = {
  x: 0,
  y: 0,
  hp: 100,
  vel: 15,
  atk: 5,
  vivo: true
}

let ovos = []
let npcs = []

//PLAYER
function mover(direcao) {
  
  if (direcao === "direita") player.x += player.vel
  if (direcao === "esquerda") player.x -= player.vel
  if (direcao === "cima") player.y -= player.vel
  if (direcao === "baixo") player.y += player.vel
  
  //limites mapa
  if (player.x > maxX) player.x = maxX
  if (player.x < 0) player.x = 0
  if (player.y > maxY) player.y = maxY
  if (player.y < 0) player.y = 0
  
  personagem.style.left = player.x + "px"
  personagem.style.top = player.y + "px"
  
  atualizarCamera()
  verificarCasa()
}

//camera
function atualizarCamera() {
  mapa.style.left = -player.x + 150 + "px"
  mapa.style.top = -player.y + 150 + "px"
}



//NPC
function criarNpc(quant) {
  
  let quantidade = Math.floor(Math.random() * quant) + 1
  
  for (let i = 0; i < quantidade; i++) {
    
    let npc = {
      tipo: "galinha",
      vel: 5,
      hp: 100,
      atk: 5,
      x: Math.random() * maxX,
      y: Math.random() * maxY,
      direcao: Math.floor(Math.random() * 4)
    }
    
    npcs.push(npc)
  }
  
  mostrarNpc()
}


//render npc
function mostrarNpc() {
  
  document.querySelectorAll('.npc').forEach(n => n.remove())
  
  npcs.forEach(npc => {
    
    const div = document.createElement('div')
    div.classList.add('npc')
    
    div.style.left = npc.x + "px"
    div.style.top = npc.y + "px"
    
    mapa.appendChild(div)
  })
}


//update npc
function atualizarNpc() {
  
  const lista = document.querySelectorAll('.npc')
  
  lista.forEach((div, i) => {
    
    div.style.left = npcs[i].x + "px"
    div.style.top = npcs[i].y + "px"
  })
}


//IA galinhas
function moverG() {
  
  npcs.forEach(npc => {
    
    let dx = npc.x - player.x
    let dy = npc.y - player.y
    
    let distancia = Math.sqrt(dx * dx + dy * dy)
    
    let d1 = 60
    let d2 = 120
    let datk = 20
    
    let velAtual = npc.vel
    
    if (coletadoO) {
      d1 += 120
      d2 -= 60
      datk = datk * 2
      velAtual += 3
    }
    
    if (distancia <= datk) {
      if (player.vivo) {
        if(player.hp <= 0){
          player.vivo = false
        } else {
        player.hp -= npc.atk
       console.log(player.hp)
        }
      }
    }
      
    
    
    //perseguir player
    if (distancia <= d1) {
      
      if (player.x > npc.x) npc.x += velAtual
      if (player.x < npc.x) npc.x -= velAtual
      
      if (player.y > npc.y) npc.y += velAtual
      if (player.y < npc.y) npc.y -= velAtual
    }
    
    //fugir player
    else if (distancia <= d2) {
      
      if (player.x > npc.x) npc.x -= velAtual
      if (player.x < npc.x) npc.x += velAtual
      
      if (player.y > npc.y) npc.y -= velAtual
      if (player.y < npc.y) npc.y += velAtual
    }
    
    //andar aleatório
    else {
      
      if (Math.random() < 0.02) {
        npc.direcao = Math.floor(Math.random() * 4)
      }
      
      if (npc.direcao === 0) npc.x += velAtual
      if (npc.direcao === 1) npc.x -= velAtual
      if (npc.direcao === 2) npc.y += velAtual
      if (npc.direcao === 3) npc.y -= velAtual
    }
    
    //limites
    npc.x = Math.max(0, Math.min(maxX, npc.x))
    npc.y = Math.max(0, Math.min(maxY, npc.y))
  })
}


//OVOS
function soltarOvo(npc) {
  
  if (Math.random() < 0.25) {
    
    ovos.push({
      x: npc.x,
      y: npc.y
    })
    
    mostrarOvos()
  }
}


//render ovos
function mostrarOvos() {
  
  document.querySelectorAll('.ovo').forEach(o => o.remove())
  
  ovos.forEach(ovo => {
    
    const div = document.createElement('div')
    
    div.classList.add('ovo')
    
    div.style.left = ovo.x + "px"
    div.style.top = ovo.y + "px"
    
    mapa.appendChild(div)
  })
}


//coletar ovos
function verificarColeta() {
  
  ovos = ovos.filter(ovo => {
    
    let dx = Math.abs(player.x - ovo.x)
    let dy = Math.abs(player.y - ovo.y)
    
    let perto = dx < 30 && dy < 30
    
    if (perto) {
      oC = oC += 1
      coletadoO = true
      
      setTimeout(() => {
        coletadoO = false
      }, 4000)
      
      return false
    }
    
    return true
  })
  
  mostrarOvos()
}


function verificarCasa() {

  casas.forEach(casa => {

    let dx = player.x - casa.x
    let dy = player.y - casa.y
    let distancia = Math.sqrt(dx * dx + dy * dy)
    if(distancia < 20){
      onde = (casa.tipo)
    }else{
      onde = ""
    }
    if(onde === "loja"){
      stopGame(j, m)
    }
  })

}


//loop ovos npc
function gerarOvosDosNPCs() {
  
  npcs.forEach(soltarOvo)
}


//LOOPS
function startGame(j,m) {
  
  loopNpc = setInterval(() => {
    moverG()
    atualizarNpc()
  }, 500)
  
  loopOvos = setInterval(gerarOvosDosNPCs, 3000)
  
  loopColeta = setInterval(verificarColeta, 100)
  
  m.classList.add("hidden");
  j.classList.remove("hidden");
  
}

function stopGame(j,m) {
  
  clearInterval(loopNpc)
  clearInterval(loopOvos)
  clearInterval(loopColeta)
  
  m.classList.remove("hidden");
  j.classList.add("hidden");
  o.innerText = oC;
  c.innerText = coins;
  
}

function vender() {
  
  const quant = Number(document.getElementById("quant").value)
  
  if (quant <= oC && quant > 0) {
    
    coins = coins + quant / 12
    oC = oC - quant
    
    c.innerText = coins
    o.innerText = oC
    
  } else {
    
    alert("Quantidade inválida!")
    
  }
  
}

//spawn inicial
criarNpc(n)
startGame(j,m)