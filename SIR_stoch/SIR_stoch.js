var w = 1100,
    h = 500;
    transdist = 350;
 
var vis = d3.select("#chart").append("svg")
    .attr("width", w)
    .attr("height", h);
    

/// model params

var pop =200;
var infectionDuration = 2000;
var infectionRate = 2/infectionDuration;

//// Snode
    
var sNodes = d3.range(pop).map(function(i) {
  return {radius: 30,
          type:i,
          trans:0,
          duration:0
      }
    });
    
var sNode = vis.selectAll(".sNode");      
    
var sForce = d3.layout.force()
    .nodes(sNodes)
    .links([])
    .size([w, h])
    .start();
    
sForce.on("tick", function(e) {
  sNode.attr("cx", function(d) { return d.x-transdist; })
      .attr("cy", function(d) { return d.y; });
});

function sNodeRestart() {

  sNode = sNode.data(sNodes);
  sNode.enter().append("circle")
    .attr("class", "node")
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", 8)
    .attr("fill","steelblue")
    .attr("class","sNode")
    .on("click",function(d,i){
        sNodes[i].trans = transdist;
        sNodes[i].duration = infectionDuration;
        iNodes.push(sNodes[i]);
        sNodes.splice(i,1);
        sNodeRestart();
        iNodeRestart();
    });
  sNode.exit().remove();

  sForce.start();
}
 
 sNodeRestart();
 
 //// Inode
    
var iNodes = d3.range(0).map(function(i) {
  return {radius: 30,
          type:i,
          trans:0,
          duration:0
      }
    });
    
var iNode = vis.selectAll(".iNode");      
    
var iForce = d3.layout.force()
    .nodes(iNodes)
    .links([])
    .size([w, h])
    .start();
    
iForce.on("tick", function(e) {
    iNode.attr("cx", function(d) {
        if(d.trans>0){d.trans+=-5;};
        return d.x-d.trans;
    })
    .attr("cy", function(d) { return d.y; });
});

setInterval(function () {
    for(var i=0;i<iNodes.length;i++){
        iNodes[i].duration +=-1;
        var infect = Math.random();
        if(infect<infectionRate){infection()};
        if(iNodes[i].duration<0){
            iNodes[i].trans = transdist;
            iNodes[i].duration = 0;
            rNodes.push(iNodes[i]);
            iNodes.splice(i,1);
            iNodeRestart();
            rNodeRestart();
            i+=-1;
        };
    };
});

function iNodeRestart() {

  iNode = iNode.data(iNodes);
  iNode.enter().append("circle")
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", 8)
    .attr("fill","red")
    .attr("class","iNode");
  iNode.exit().remove();

  iForce.start();
}
 
 iNodeRestart();
 
 //rNodes
 
 var rNodes = d3.range(0).map(function(i) {
  return {radius: 30,
          type:i,
          trans:0,
          duration:0
      }
    });
    
var rNode = vis.selectAll(".rNode");      
    
var rForce = d3.layout.force()
    .nodes(rNodes)
    .links([])
    .size([w, h])
    .start();
    
rForce.on("tick", function(e) {
  rNode.attr("cx", function(d) { if(d.trans>0){d.trans+=-5;};return d.x+transdist-d.trans; })
      .attr("cy", function(d) { return d.y; });
});

function rNodeRestart() {

  rNode = rNode.data(rNodes);
  rNode.enter().append("circle")
    .attr("class", "node")
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", 8)
    .attr("fill","green")
    .attr("class","rNode");
  rNode.exit().remove();

  rForce.start();
}
 
 rNodeRestart();
 
 function infection(){
     var infected = Math.floor(Math.random()*pop);
     if(infected<sNodes.length){
        sNodes[infected].trans = transdist;
        sNodes[infected].duration = infectionDuration;
        iNodes.push(sNodes[infected]);
        sNodes.splice(infected,1);
        sNodeRestart();
        iNodeRestart();         
     }
 }