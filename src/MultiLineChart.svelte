<script>
  export let href =
    'https://theoutlier.co.za/covid-19/81382/covid-19-sa-vaccination-tracker/'
  import { onMount } from 'svelte'
  import { parseTime, formatDateAbbr, formatMillions } from './functions.js'
  import { scaleLinear, scaleTime } from 'd3-scale'
  import { max } from 'd3-array'
  import SidebarButton from './SidebarButton.svelte'

  let chartWidth
  let width
  let height = 250
  let margin = { top: 20, right: 40, bottom: 20, left: 30 }
  let minX
  let maxX
  let days = 180
  let xTicks = []
  let yTicks = []
  let yTicks2 = []
  for (let x = 0; x < 300000; x = x + 100000) {
    yTicks.push(x)
  }
  for (let x = 0; x < 30000; x = x + 10000) {
    yTicks2.push(x)
  }

  let months = [
    '2021-06-01',
    '2021-07-01',
    '2021-08-01',
    '2021-09-01',
    '2021-10-01',
  ]
  months.forEach((d) => {
    xTicks.push(parseTime(d, '%Y-%m-%d'))
  })

  $: width = chartWidth
  //   $: height = chartWidth * 0.5

  let data = []
  let dataSource = 'https://api.mediahack.co.za/outlier/vax-cases.php'

  async function getData() {
    await fetch(dataSource)
      .then((response) => response.json())
      .then((response) => {
        data = response.filter((d, i) => i > response.length - days)

        data.forEach((d) => {
          d.date = parseTime(d.date, '%d-%m-%Y')
          d.sevenDay = +d['7_day_weekly_average']
          d.vaccinationsSevenDay = +d['vaccinations_7_day_average']
        })

        minX = data[0].date
        maxX = data[data.length - 1].date
      })
  }

  $: xScale = scaleTime()
    .domain([minX, maxX])
    .range([margin.left, width - margin.right])

  $: yScale = scaleLinear()
    .domain([0, 250000])
    .range([height - margin.bottom, margin.top])

  $: yScale2 = scaleLinear()
    .domain([0, 25000])
    .range([height - margin.bottom, margin.top])

  // vaccinations path
  $: path = `M${data
    .map((p) => `${xScale(p.date)},${yScale(p.vaccinationsSevenDay)}`)
    .join('L')}`
  $: area = `${path}L${xScale(maxX)},${yScale(0)}L${xScale(minX)},${yScale(0)}Z`

  // cases path
  $: pathCases = `M${data
    .map((p) => `${xScale(p.date)},${yScale2(p.sevenDay)}`)
    .join('L')}`

  onMount(() => {
    getData()
  })
</script>

<div class="line-chart">
  <div class="chart-wrap" bind:clientWidth={chartWidth}>
    <h2>SA Covid-19 Tracker</h2>
    <div class="subhead">Updated daily</div>
    <!-- <p>
      Our vaccination tracker is updated daily when new data becomes available.
    </p> -->
    <svg {width} {height}>
      <!-- y ticks -->
      <g class="axis y-axis axis-right">
        <g class="grid-lines">
          {#each yTicks as tick}
            <line
              x1={margin.left}
              x2={width - margin.right}
              y1={yScale(tick)}
              y2={yScale(tick)}
            />
            <text x={width - margin.right + 4} y={yScale(tick) + 3}
              >{formatMillions(tick)}</text
            >
          {/each}
        </g>
      </g>
      <!-- end y ticks -->

      <!-- y ticks 2 -->
      <g class="axis y-axis axis-left">
        <g class="tick">
          {#each yTicks2 as tick}
            <line
              class="tick"
              x1={margin.left}
              x2={width - margin.right}
              y1={yScale2(tick)}
              y2={yScale2(tick)}
            />
            <text x={margin.left - 4} y={yScale2(tick) + 3}
              >{formatMillions(tick)}</text
            >
          {/each}
        </g>
      </g>
      <!-- end y ticks -->

      <!-- x axis -->
      <g class="axis x-axis axis-bottom">
        <g class="ticks">
          {#each xTicks as tick}
            <line
              class="tick"
              x1={xScale(tick)}
              x2={xScale(tick)}
              y1={height - 15}
              y2={height - 20}
            />
            <text x={xScale(tick)} y={height - 2}>{formatDateAbbr(tick)}</text>
          {/each}
        </g>
      </g>
      <!-- end x axis -->

      <path class="path-area" d={area} />
      <path class="path-line" d={path} />
      <path class="path-line-second" d={pathCases} />

      <text
        class="annotation annotation-center"
        x={width - margin.right - 80}
        y="40">Daily vaccinations</text
      >
      <text
        class="annotation annotation-center"
        x={width - margin.right - 80}
        y="55">(7-day average)</text
      >

      <text
        class="annotation annotation-left"
        x={margin.left + 100}
        y={height - 65}>New daily cases</text
      >
      <text
        class="annotation annotation-left"
        x={margin.left + 100}
        y={height - 50}>(7-day average)</text
      >
    </svg>

    <SidebarButton {href}>See all data</SidebarButton>
  </div>
</div>

<style>
  .chart-wrap {
    width: 100%;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  .path-line {
    fill: none;
    stroke: var(--blue);
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 3;
  }
  .path-line-second {
    fill: none;
    stroke: var(--outlierRed);
    stroke-width: 3;
  }
  .path-area {
    fill: var(--lightBlue);
    opacity: 0.7;
  }
  .grid-lines line {
    stroke: var(--axisGray);
    stroke-dasharray: 3, 3;
    stroke-width: 1px;
  }
  .axis text {
    font-size: 0.7rem;
    fill: var(--axisGrayDark);
  }
  .y-axis text {
    text-anchor: end;
  }
  .x-axis text {
    text-anchor: middle;
  }
  .axis-right text {
    text-anchor: start;
    fill: var(--blue);
  }
  .axis-left text {
    fill: var(--outlierRed);
    text-anchor: end;
  }
  .axis-bottom text {
    text-anchor: middle;
  }
  .annotation {
    font-family: 'Roboto', Arial, Helvetica, sans-serif;
    font-weight: 700;
    text-anchor: middle;
    font-size: 0.8rem;
    stroke-width: 5px;
    stroke: #fff;
    paint-order: stroke;
  }
  .annotation-center {
    fill: var(--blue);
  }
  /* .annotation-right {
    fill: var(--blue);
  } */
  .annotation-left {
    fill: var(--outlierRed);
  }
  .x-axis line {
    stroke: var(--axisGray);
    stroke-width: 1px;
  }
</style>
