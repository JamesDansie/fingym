'use strict';

var allPositions = [];
var allBuckets = [];

function Position(name, marketValue, posYield, risk){
  this.name = name;
  this.marketValue = marketValue;

  //Input in %
  this.posYield = posYield/100;
  this.monthlyIncome = marketValue * posYield / 12;
  this.risk = risk;

  allPositions.push(this);
}

function Bucket(name){
  this.name = name;
  this.allocation = [];

  allBuckets.push(this);
}

Bucket.prototype.setPosition = function(Position, posAllocation){
  this.allocation.push({
    Position: Position,
    allocation: posAllocation
  });
};

var riskyBucket = new Bucket('risky');
var rmcf = new Position('rmcf', 1000, 5, 4);

riskyBucket.setPosition(rmcf, 5);
