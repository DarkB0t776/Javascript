const record = document.getElementById('record');
const shotsNumber = document.getElementById('shot');
const hitsNumber = document.getElementById('hit');
const shipsSunk = document.getElementById('dead');
const enemy = document.getElementById('enemy');
const again = document.getElementById('again');
const title = document.querySelector('.header');

const play = {
  record: localStorage.getItem('battleShipRecord') || 0,
  shotsNumber: 0,
  hitsNumber: 0,
  shipsSunk: 0,
  set updateData(data){
    this[data] += 1;
    this.render();
  },
  render(){
    record.textContent = this.record;
    shotsNumber.textContent = this.shotsNumber;
    hitsNumber.textContent = this.hitsNumber;
    shipsSunk.textContent = this.shipsSunk;
  }
};

const game = {
  ships: [

  ],
  shipCount: 0,
  optionShip: {
    count: [1,2,3,4],
    size: [4,3,2,1]
  },
  collision: new Set(),
  generateShip() {
    for(let i = 0; i < this.optionShip.count.length; i++){

      for(let j = 0; j < this.optionShip.count[i]; j++){
        const size = this.optionShip.size[i];
        const ship = this.generateOptionsShip(size);
        this.ships.push(ship);
        this.shipCount++;
      }
    }
  },
  generateOptionsShip(shipSize) {
    const ship = {
      hit: [],
      location: []
    };

    const direction = Math.random() < 0.5;
    let x, y;

    if (direction) {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * (10 - shipSize));
    } else {
      x = Math.floor(Math.random() * (10 - shipSize));
      y = Math.floor(Math.random() * 10);
    }

    for (let i = 0; i < shipSize; i++) {
      if (direction) {
        ship.location.push(x + '' + (y + i));
      } else {
        ship.location.push((x + i) + '' + y);
      }
      ship.hit.push('');
    }

    if(this.checkCollision(ship.location)){
      return this.generateOptionsShip(shipSize);
    }

    this.addCollision(ship.location);

    return ship;
  },
  checkCollision(location){
    for (const coord of location) {
      if (this.collision.has(coord)) {
        return true;
      }
    }
  },
  addCollision(location) {
    for (let i = 0; i < location.length; i++) {
      const startCoordX = location[i][0] - 1;
      for (let j = startCoordX; j < startCoordX + 3; j++) {
        const startCoordY = location[i][1] - 1;

        for (let z = startCoordY; z < startCoordY + 3; z++) {
          if (j >= 0 && j < 10 && z >= 0 && z < 10) {
            const coord = j + '' + z;
            this.collision.add(coord);
          }
        }
      }
    }
  }
};

const show = {
  hit(target){
    this.changeClass(target, 'hit');
  },
  miss(target){
    this.changeClass(target, 'miss');
  },
  dead(id){
    const target = document.getElementById(id);
    this.changeClass(target, 'dead');
  },
  changeClass(target, value){
    target.className = value;
  }
};

const fire = (event) => {
  const target = event.target;
  const classes = ['miss', 'hit', 'dead'];
  if(classes.includes(target.className) || target.tagName !== 'TD'){
    return;
  }
  show.miss(target);
  play.updateData = 'shotsNumber';

  for(let i = 0; i < game.ships.length; i++) {
    const ship = game.ships[i];
    const index = ship.location.indexOf(target.id);
    if(index >= 0){
      show.hit(target);
      play.updateData = 'hitsNumber';
      ship.hit[index] = 'x';
      const life = ship.hit.indexOf('');
      if(life < 0){
        play.updateData = 'shipsSunk';
        for(const cell of ship.location){
          show.dead(cell);
        }

        game.shipCount -= 1;

        if(game.shipCount < 1){
          title.textContent = 'Game is Over!';
          title.style.color = 'red';
          if(play.shotsNumber < play.record || play.record === 0){
            localStorage.setItem('battleShipRecord', play.shotsNumber);
            play.record = play.shotsNumber;
            play.render();
          }

          enemy.removeEventListener('click', fire);
        }
      }
    }
  }
};

const init = () => {
  enemy.addEventListener('click', fire);
  play.render();
  game.generateShip();

  again.addEventListener('click', () => {
    location.reload();
  });
  record.addEventListener('dblclick', () => {
    localStorage.clear();
    play.record = 0;
    play.render();
  });

  console.log(game.ships);
};

init();