import * as d3 from "https://cdn.skypack.dev/d3@7";

export const generatePointsForArcs = (arcs) => {
  var allPoints = []
  arcs.forEach((arc) => {
    allPoints = allPoints.concat(getPointsForArcWithProperties(arc))
  })
  return sortedPointsByOverallLocation(allPoints)
}

const getPointsForArcWithProperties = (arc) => {
  let innerRadius = arc.innerRadius
  let outerRadius = arc.outerRadius
  let numberOfPoints = arc.numberOfPoints

  let mainStartAngle = -(Math.PI / 2)
  let mainEndAngle = Math.PI / 2

  let arcAngleSize = (mainEndAngle - mainStartAngle) / numberOfPoints

  var points = []
  for (let i = 0; i < numberOfPoints; i++) {
    let arcStartAngle = mainStartAngle + (arcAngleSize * i)
    let arcEndAngle = arcStartAngle + arcAngleSize

    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(arcStartAngle)
      .endAngle(arcEndAngle)

    let arcCenterPoint = arc.centroid()
    points.push({ x: arcCenterPoint[0], y: arcCenterPoint[1] })
  }
  return points
}

const sortedPointsByOverallLocation = (points) => {
  points.sort((a, b) => {
    if (a.x < b.x) {
      return -1
    }
    if (a.x > b.x) {
      return 1
    }
    return 0
  })
  return points
}