'use strict';

var allPositions = [];
var allBuckets = [];
var totalMarketValue = 0;
var totalMonthlyIncome = 0;
var tbody = document.getElementsByTagName('tbody')[0];
var tfoot = document.getElementsByTagName('tfoot')[0];

function Position(name, marketValue, posYield, risk){
  this.name = name;
  this.marketValue = marketValue;

  //Input in %
  this.posYield = posYield/100;
  this.monthlyIncome = marketValue * this.posYield / 12;
  this.risk = risk;

  allPositions.push(this);
}

function Bucket(name){
  this.name = name;
  this.targetAllocation = [];
  this.total = 0;

  allBuckets.push(this);
}

//This adds the position and it's target allocation to the targetAllocation array
Bucket.prototype.setPosition = function(Position, posAllocation){
  this.targetAllocation.push({
    Position: Position,
    targetAllocation: posAllocation / 100
  });
};

//This calulates the actual allocation
Bucket.prototype.calculateAllocations = function(){
  //First we calculate the total market value of the bucket
  for(var i = 0; i < this.targetAllocation.length; i++){
    this.total += this.targetAllocation[i].Position.marketValue;
  }

  for(var i = 0; i <this.targetAllocation.length; i++){
    //Calculate the actual allocation
    this.targetAllocation[i].actualAllocation = this.targetAllocation[i].Position.marketValue / this.total;
    
    //Calculate the difference between actual and target allocatiosn
    this.targetAllocation[i].drift = this.targetAllocation[i].actualAllocation - this.targetAllocation[i].targetAllocation;
  }
};

//Add element function
function addElement(childElType, childText, ParentEl){
  var childEl = document.createElement(childElType);
  childEl.textContent = childText;
  ParentEl.appendChild(childEl);
}

//Makes the table body
function renderTBody(){
  //for each bucket
  allBuckets.forEach(function(bucket){

    //within each bucket target the position
    bucket.targetAllocation.forEach(function(pos){
      var trEl = document.createElement('tr');
      tbody.appendChild(trEl);

      addElement('td', pos.Position.name, trEl);
      addElement('td', pos.Position.marketValue, trEl);
      addElement('td', parseFloat(pos.Position.posYield*100).toFixed(2), trEl);
      addElement('td', parseFloat(pos.Position.monthlyIncome).toFixed(2), trEl);
      addElement('td', pos.Position.risk, trEl);
      addElement('td', bucket.name, trEl);
      addElement('td', parseFloat(pos.targetAllocation*100).toFixed(2), trEl);
      addElement('td', parseFloat(pos.actualAllocation*100).toFixed(2), trEl);
      addElement('td', parseFloat(pos.drift*100).toFixed(2), trEl);

      totalMarketValue += pos.Position.marketValue;
      totalMonthlyIncome += pos.Position.monthlyIncome;
    });
  });
}

function renderTFoot(){
  var trEl = document.createElement('tr');
  tfoot.appendChild(trEl);

  addElement('th', 'Total', trEl);
  addElement('td', parseFloat(totalMarketValue).toFixed(2), trEl);
  addElement('td', '-', trEl);
  addElement('td', parseFloat(totalMonthlyIncome).toFixed(2), trEl);
  for(var i = 0; i < 5; i++){
    addElement('td', '-', trEl);
  }
}

$(document).ready(function(){
  
  $('tbody').append('blah');
  renderTBody();
  renderTFoot();
});

var retirementBucket = new Bucket('retirement');
var rainyDayBucket = new Bucket('rainyDay');

var rmcf = new Position('rmcf', 1000, 5, 4);
var aapl = new Position('aapl', 5000, 1.3, 3);
var voo = new Position('voo', 20000, 2.3, 2);
var SoundCU = new Position('SoundCU', 15000, 0, 1);
var AllyRainy = new Position('AllyRainy', 17000, 0, 1);

retirementBucket.setPosition(rmcf, 4);
retirementBucket.setPosition(aapl, 10);
retirementBucket.setPosition(voo, 70);

rainyDayBucket.setPosition(SoundCU, 40);
rainyDayBucket.setPosition(AllyRainy, 60);

retirementBucket.calculateAllocations();
rainyDayBucket.calculateAllocations();

//animation?
var wrapper = document.querySelector('.wrapper');

// wrapper.classList.add('animate');  

setInterval(function () {   
  wrapper.classList.add('animate');  
}, 1000);

setInterval(function () {  
  wrapper.classList.remove('animate');   
}, 8500);
