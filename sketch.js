let dataset;
let centroid;
let myPoints;
var points = [
  {x: 400, y: 200, cluster: -1},
  {x: 100, y: 122, cluster: -1},
  {x: 200, y: 121, cluster: -1},
  {x: 300, y: 340, cluster: -1},
  {x: 230, y: 123, cluster: -1},
  {x: 112, y: 245, cluster: -1},
  {x: 123, y: 56, cluster: -1},
  {x: 512, y: 378, cluster: -1},
  {x: 489, y: 378, cluster: -1},
  {x: 578, y: 389, cluster: -1},
  {x: 512, y: 367, cluster: -1},
  {x: 598, y: 297, cluster: -1},
  {x: 498, y: 389, cluster: -1},
  {x: 389, y: 367, cluster: -1},
  {x: 467, y: 356, cluster: -1},
  {x: 12, y: 234, cluster: -1},
  {x: 123, y: 123, cluster: -1},
  {x: 234, y: 267, cluster: -1},
  {x: 267, y: 298, cluster: -1},
  {x: 123, y: 234, cluster: -1},
  {x: 321, y: 321, cluster: -1},
  {x: 276, y: 245, cluster: -1},
  {x: 367, y: 398, cluster: -1},
]

var centroids = [
  {
    name: 'green',
    color: {r: 0, g: 255, b: 0},
    point: {x: 0, y: 0}
  },
  {
    name: 'red',
    color: {r: 255, g: 0, b: 0},
    point: {x: 0, y: 0}
  }
]

function preload(){
  dataset = loadTable('cars.csv','header'); 
}

function setup() {
  // Create a responsive canvas that adjusts to the screen size
  createCanvas(windowWidth, windowHeight);  // Use windowWidth and windowHeight for dynamic canvas size

  for (var i = 0; i < centroids.length; i++) {
    centroids[i].point.x = random(width);
    centroids[i].point.y = random(height);  
  }
}

function draw() {
  background(0);
  
  // Draw the decision boundary (classification line) between clusters
  drawDecisionBoundary();

  // Draw points with colors based on their clusters
  for (var i = 0; i < points.length; i++) {
    var point = points[i];
    if (point.cluster == -1) {
      fill(255); // no cluster assigned, use white
    } else {
      var centroid = centroids[point.cluster];
      fill(centroid.color.r, centroid.color.g, centroid.color.b);
    }
    ellipse(point.x, point.y, 10, 10);  
  }

  // Draw centroids
  for (var i = 0; i < centroids.length; i++) {
    let centroid = centroids[i];
    fill(centroid.color.r, centroid.color.g, centroid.color.b);
    ellipse(centroid.point.x, centroid.point.y, 30, 30); 
  }

  // Draw mouse pointer coordinates
  textSize(10);
  fill(255);
  text(mouseX + ", " + mouseY, 20, 20)
}

function mousePressed() {
  // Assign points to clusters
  for (var i = 0; i < points.length; i++) {
    var point = points[i];
    var distances = [];
    var minDistance = Infinity;  // Set a high initial value for the distance
    for (var j = 0; j < centroids.length; j++) {
      var centroid = centroids[j];
      var newDistance = dist(point.x, point.y, centroid.point.x, centroid.point.y);
      if (newDistance < minDistance) {
        minDistance = newDistance;
        point.cluster = j;
      }
    }
  }

  // Move centroids to the centers of all clustered points
  for (var i = 0; i < centroids.length; i++) {
    let centroid = centroids[i];
    
    // Get all points that belong to the current cluster
    let myPoints = points.filter(point => point.cluster == i);
    
    // Calculate the new centroid position
    if (myPoints.length > 0) {
      var newX = myPoints.map(function(point) {
        return point.x
      });
      centroid.point.x = getMean(newX);
      
      var newY = myPoints.map(function(point) {
        return point.y
      });
      centroid.point.y = getMean(newY);
    }
  }
}

function getMean(values) {
  return round(values.reduce(function(sum, value) { return sum + value }, 0) / values.length);
}

// Draw the decision boundary
function drawDecisionBoundary() {
  noFill();
  stroke(255, 0, 0); // Red line for the boundary
  
  // Loop through the whole canvas
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // Compute distance from each centroid to the current pixel (x, y)
      let d1 = dist(x, y, centroids[0].point.x, centroids[0].point.y); // Distance to centroid 1
      let d2 = dist(x, y, centroids[1].point.x, centroids[1].point.y); // Distance to centroid 2

      // If the distances are equal, draw a boundary line (this means both centroids are equidistant)
      if (abs(d1 - d2) < 1) {  // If the distances are almost equal, this is where the decision boundary lies
        point(x, y);  // Draw a small point to mark the boundary
      }
    }
  }
}
