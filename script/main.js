import * as d3 from "https://cdn.skypack.dev/d3@7";
import { partiesColors, canvasProperties, arcs } from "./constants.js"
import { fetchSenatorsSortedByParty } from "./repository.js"
import { generatePointsForArcs } from "./pointsGenerator.js";

// ######################################
// ### HELPER CONSTANTS AND FUNCTIONS ###
// ######################################

const { canvasWidth, canvasHeight } = canvasProperties
const svgCanvasId = "#svg-canvas"
const tooltipId = "#tooltip"

const senatorsZippedWithPoints = async () => {
  var senators = await fetchSenatorsSortedByParty()
  console.log(senators);

  const allPoints = generatePointsForArcs(arcs)
  console.log(allPoints)

  senators = senators.map((senator, i) => {
    const point = allPoints[i]
    return { ...senator, point }
  })

  return senators
}

const buildSvgCanvas = () => {
  // const svg = d3.create("svg")
  return d3.select(svgCanvasId)
    .style("canvasWidth", canvasWidth)
    .style("canvasHeight", canvasHeight)
    .attr("viewBox", [-canvasWidth / 2, -canvasHeight, canvasWidth, canvasHeight])
}

// # Actions
var mouseover = function (event) {
  const senatorIndex = event.srcElement.attributes.senatorIndex.value
  const senatorName = senators[senatorIndex].name

  // d3.select(tooltipId)
  //   .html(senatorName)
  //   .style("opacity", 1)

  d3.select(this)
    .classed("selected", true)
}
var mousemove = function (event) {
  d3.select(tooltipId)
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
  // d3.select(tooltipId)
  //   .style("opacity", 0)

  d3.select(this)
    .classed("selected", false)
}


// ######################################
// ########### MAIN EXECUTION ###########
// ######################################

const senators = await senatorsZippedWithPoints()

const svg = buildSvgCanvas()
svg.selectAll("circle")
  .data(senators)
  .enter().append("circle")
  .style("fill", (senator) => {
    let party = senator.party
    console.log(`SENATOR: ${senator}`)
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