'use strict';

var allPositions = [];
var allBuckets = [];
var totalMarketValue = 0;
var totalMonthlyIncome = 0;
var tbody = document.getElementsByTagName('tbody')[0];
var tfoot = document.getElementsByTagName('tfoot')[0];
var incomeForm = document.getElementById('income');
var expenseForm = document.getElementById('expenses');
var bucketForm = document.getElementById('bucketCreation');
var positionForm = document.getElementById('positionCreation');
var allocationForm = document.getElementById('addAllocation');

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

function renderTBodyJQuery(){
  $('tbody').html("");
  //Rendering the table body
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

      totalMarketValue += bucketData.Position.marketValue;
      totalMonthlyIncome += bucketData.Position.monthlyIncome;
    });
  });
}

function renderTFootJQuery(){
  //Rendering footer
  $('tfoot').append('<tr></tr>');
  $('tfoot tr:last-child').append('<th>Total</th>');
  $('tfoot tr:last-child').append($('<td></td>').text(parseFloat(totalMarketValue).toFixed(2)));
  $('tfoot tr:last-child').append($('<td></td>').text('-'));
  $('tfoot tr:last-child').append($('<td></td>').text(parseFloat(totalMonthlyIncome).toFixed(2)));
  for(var i = 0; i < 5; i++){
    $('tfoot tr:last-child').append($('<td></td>').text('-'));
  }
}

function renderBucketList(){
  $('#buckets').html('');
  allBuckets.forEach(function(bucket){
    $('#buckets').append(`<option value = ${bucket.name}></option>`);
  });
}

function renderPositionList(){
  $('#positions').html('');
  allPositions.forEach(function(pos){
    $('#positions').append(`<option value = ${pos.name}></option>`);
  });
}

incomeForm.addEventListener('submit', function(e){
  e.preventDefault();

  console.log(e.target.income.value);
  $('#incomePrint').text(`Income: $${e.target.income.value} per month`);
});

expenseForm.addEventListener('submit', function(e){
  e.preventDefault();

  console.log(e.target.expenses.value);
  $('#expensesPrint').text(`Expenses: $${e.target.expenses.value} per month`);
});

bucketForm.addEventListener('submit', function(e){
  e.preventDefault();

  console.log(e.target.bucketName.value);
  new Bucket(e.target.bucketName.value);
  renderBucketList();
});

positionForm.addEventListener('submit', function(e){
  e.preventDefault();

  console.log(e.target.positionName.value);
  console.log(e.target.positionMarketValue.value);
  console.log(e.target.positionYield.value);
  console.log(e.target.positionRisk.value);

  new Position(e.target.positionName.value,
    e.target.positionMarketValue.value,
    e.target.positionYield.value,
    e.target.positionRisk.value);

  renderPositionList();
});

allocationForm.addEventListener('submit', function(e){
  e.preventDefault();

  console.log(e.target.bucket.value);
  console.log(e.target.targetAllocation.value);
  console.log(e.target.position.value);

  for(var i = 0; i < allBuckets.length; i++){
    for(var j = 0; j < allPositions.length; j++){
      if(allBuckets[i].name === e.target.bucket.value && allPositions[j].name === e.target.position.value){
        allBuckets[i].setPosition(allPositions[j], e.target.targetAllocation.value);
        allBuckets[i].calculateAllocations();
      }
    }
  }

  renderTBodyJQuery();
});

//Making initial positions
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

setInterval(function () {
  wrapper.classList.add('animate');
}, 1000);

setInterval(function () {
  wrapper.classList.remove('animate');
}, 8500);

$(document).ready(function(){

  renderTBodyJQuery();
  renderTFootJQuery();

});
