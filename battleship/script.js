const record = document.getElementById('record');
const shotsNumber = document.getElementById('shot');
const hitsNumber = document.getElementById('hit');
const shipsSunk = document.getElementById('dead');
const enemy = document.getElementById('enemy');
const again = document.getElementById('again');

const play = {
  record: 0,
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

const show = {
  hit(){},
  miss(target){
    this.changeClass(target, 'miss');
  },
  dead(){},
  changeClass(target, value){
    target.className = value;
  }
};

const fire = (event) => {
  const target = event.target;
  const classes = ['miss', 'hit', 'dead'];
  if(classes.includes(target.className)){
    return;
  }
  show.miss(target);
  play.updateData = 'shotsNumber';
};

const init = () => {
  enemy.addEventListener('click', fire);
};

init();