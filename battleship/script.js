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
    {
      location: ['26', '36', '46', '56'],
      hit: ['','','','']
    },
    {
      location: ['11','12', '13'],
      hit: ['','', '']
    },
    {
      location: ['69', '79'],
      hit: ['', '']
    },
    {
      location: ['32'],
      hit: ['']
    }
  ],
  shipCount: 4
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

  again.addEventListener('click', () => {
    location.reload();
  });
};

init();