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

    //within each bucket grab the data
    bucket.targetAllocation.forEach(function(bucketData){
      var trEl = document.createElement('tr');
      tbody.appendChild(trEl);

      addElement('td', bucketData.Position.name, trEl);
      addElement('td', bucketData.Position.marketValue, trEl);
      addElement('td', parseFloat(bucketData.Position.posYield*100).toFixed(2), trEl);
      addElement('td', parseFloat(bucketData.Position.monthlyIncome).toFixed(2), trEl);
      addElement('td', bucketData.Position.risk, trEl);
      addElement('td', bucket.name, trEl);
      addElement('td', parseFloat(bucketData.targetAllocation*100).toFixed(2), trEl);
      addElement('td', parseFloat(bucketData.actualAllocation*100).toFixed(2), trEl);
      addElement('td', parseFloat(bucketData.drift*100).toFixed(2), trEl);

      totalMarketValue += bucketData.Position.marketValue;
      totalMonthlyIncome += bucketData.Position.monthlyIncome;
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
  // $('tbody').append('blah');
  // renderTBody();
  // renderTFoot();
  // $('tbody').append('<tr></tr>');
  // var blah = $('<td></td>').text('hello');
  // $('tbody tr:last-child').append(blah);
  // $('tbody tr:last-child').append('hi');


  allBuckets.forEach(function(bucket){
    bucket.targetAllocation.forEach(function(bucketData){
      //for each allocation we're making a new row, then appending td's with data
      $('tbody').append('<tr></tr>');
      $('tbody tr:last-child').append($('<td></td>').text(bucketData.Position.name));
      $('tbody tr:last-child').append($('<td></td>').text(bucketData.Position.marketValue));
      $('tbody tr:last-child').append($('<td></td>').text(parseFloat(bucketData.Position.posYield*100).toFixed(2)));
      $('tbody tr:last-child').append($('<td></td>').text(parseFloat(bucketData.Position.monthlyIncome).toFixed(2)));
      $('tbody tr:last-child').append($('<td></td>').text(bucketData.Position.risk));
      $('tbody tr:last-child').append($('<td></td>').text(bucket.name));
      $('tbody tr:last-child').append($('<td></td>').text(parseFloat(bucketData.targetAllocation*100).toFixed(2)));
      $('tbody tr:last-child').append($('<td></td>').text(parseFloat(bucketData.actualAllocation*100).toFixed(2)));
      $('tbody tr:last-child').append($('<td></td>').text(parseFloat(bucketData.drift*100).toFixed(2)));
    });
  });


  //Rendering footer
  $('tfoot').append('<tr></tr>');
  $('tfoot tr:last-child').append('<th>Total</th>');
  $('tfoot tr:last-child').append($('<td></td>').text(parseFloat(totalMarketValue).toFixed(2)));
  $('tfoot tr:last-child').append($('<td></td>').text('-'));
  $('tfoot tr:last-child').append($('<td></td>').text(parseFloat(totalMonthlyIncome).toFixed(2)));
  for(var i = 0; i < 5; i++){
    $('tfoot tr:last-child').append($('<td></td>').text('-'));
  }
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
