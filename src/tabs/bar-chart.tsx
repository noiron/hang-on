import { useEffect } from "react"
import * as d3 from "d3"

interface BarChartProps {
  data: {
    date: string
    count: number
  }[]
  width: number
  height: number
  margin?: {
    top: number
    right: number
    bottom: number
    left: number
  }
}

const BarChart = (props: BarChartProps) => {
  useEffect(() => {
    if (!props.data || !props.data.length) return

    // set the dimensions and margins of the graph
    const margin = props.margin || { top: 30, right: 30, bottom: 40, left: 60 }
    const width = props.width - margin.left - margin.right
    const height = props.height - margin.top - margin.bottom

    // 防止重复画图，有没有其它方式解决？
    d3.select("svg").remove()

    // append the svg object to the body of the page
    const svg = d3
      .select("#wrapper")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    // Parse the Data
    const data = props.data

    // X axis
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(
        data.map(function (d) {
          return d.date
        })
      )
      .padding(0.3)

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat((val) => val.slice(5)))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")

    // Add Y axis
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count)])
      .range([height, 0])
      .nice()
    svg.append("g").call(d3.axisLeft(y))

    // Bars
    svg
      .selectAll()
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return x(d.date)
      })
      .attr("y", function (d) {
        return y(d.count)
      })
      .attr("width", x.bandwidth())
      .attr("height", function (d) {
        return height - y(d.count)
      })
      .attr("fill", "#69b3a2")

    svg
      .selectAll()
      .data(data)
      .enter()
      .append("text")
      .text(function (d) {
        return d.count
      })
      .attr("x", function (d) {
        return x(d.date) + x.bandwidth() / 2
      })
      .attr("y", function (d) {
        return y(d.count) - 10
      })
      .attr("font-family", "sans-serif")
      .attr("font-size", "14px")
      .attr("fill", "#666")
      .attr("text-anchor", "middle")
  }, [props.data])

  return (
    <div>
      <div id="wrapper"></div>
    </div>
  )
}

export default BarChart
