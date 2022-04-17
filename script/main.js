import * as d3 from "https://cdn.skypack.dev/d3@7";
import { partiesColors, canvasProperties, arcs } from "./constants.js"

let data = await d3.json("../data.json")

var senators = data["ListaParlamentarEmExercicio"]["Parlamentares"]["Parlamentar"]
senators.sort((a, b) => {
  if (a.IdentificacaoParlamentar.SiglaPartidoParlamentar < b.IdentificacaoParlamentar.SiglaPartidoParlamentar) {
    return -1
  }
  if (b.IdentificacaoParlamentar.SiglaPartidoParlamentar < a.IdentificacaoParlamentar.SiglaPartidoParlamentar) {
    return 1
  }
  return 0;
})


const svgCanvasId = "#svg-canvas"
// ## CANVAS BUILD ##
let { canvasWidth, canvasHeight } = canvasProperties
// const svg = d3.create("svg")
const svg = d3.select(svgCanvasId)
  .style("canvasWidth", canvasWidth)
  .style("canvasHeight", canvasHeight)
  .attr("viewBox", [-canvasWidth / 2, -canvasHeight, canvasWidth, canvasHeight])

var allPoints = []
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

arcs.forEach((arc) => {
  allPoints = allPoints.concat(getPointsForArcWithProperties(arc))
})

allPoints.sort((a, b) => {
  if (a.x < b.x) {
    return -1
  }
  if (a.x > b.x) {
    return 1
  }
  return 0
})

senators = senators.map((senator, i) => {
  const point = allPoints[i]
  return { ...senator, point }
})

// ## Create a tooltip ##
var tooltip = d3.select("body")
  .append("div")
  .style("opacity", 0)
  .attr("id", "tooltip")


var mouseover = function (event) {
  const senatorIndex = event.srcElement.attributes.senatorIndex.value
  const senatorName = senators[senatorIndex].IdentificacaoParlamentar.NomeParlamentar

  tooltip
    .html(senatorName)
    .style("opacity", 1)
    d3.select(this)
    .classed("selected", true)
}
var mousemove = function (event) {
  tooltip
    .style("left", () => {
      let xPoint = (canvasWidth / 2) + d3.pointer(event)[0] + 50
      // let xPoint = d3.pointer(event)[0]
      return `${xPoint}px`
    })
    .style("top", () => {
      let yPoint = (canvasHeight) + d3.pointer(event)[1] + 50
      // let yPoint = d3.pointer(event)[1]
      return `${yPoint}px`
    })
}
var mouseleave = function (d) {
  tooltip
    .style("opacity", 0)
  d3.select(this)
    .classed("selected", false)
}

svg.selectAll("circle")
  .data(senators)
  .enter().append("circle")
  .style("fill", (senator) => {
    let party = senator.IdentificacaoParlamentar.SiglaPartidoParlamentar
    return partiesColors[party]
  })
  .attr('senatorIndex', (d, i) => i)
  .attr("class", "senator-circle")
  .attr("r", 20)
  .attr("cx", (senator) => senator.point.x)
  .attr("cy", (senator) => senator.point.y)
  .on("mouseover", mouseover)
  // .on("mousemove", mousemove)
  .on("mouseleave", mouseleave)