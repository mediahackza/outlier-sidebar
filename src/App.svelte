<script>
  import MultiLineChart from './MultiLineChart.svelte'
  import SidebarButton from './SidebarButton.svelte'
  let href = 'https://theoutlier.co.za/economy/81582/sa-unemployment-tracker'
</script>

<main>
  <MultiLineChart />

  <div class="unemployment">
    <img src="/images/unemployment.png" alt="Unemployment Rate" />

    <SidebarButton {href}>See all data</SidebarButton>
  </div>
</main>

<style>
  .unemployment {
    margin-top: 100px;
  }
</style>
