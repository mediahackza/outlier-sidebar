<script>
  export let href
</script>

<div class="button-wrap-outer">
  <a {href} target="_parent">
    <div class="button-wrap">
      <div class="button-shadow"><slot /></div>
      <div class="button"><slot /></div>
    </div>
  </a>
</div>

<style>
  a {
    color: inherit;
  }
  .button-wrap-outer {
    width: 100%;
    text-align: center;
    margin-top: 30px;
  }
  .button-wrap {
    position: relative;
    width: 110px;
    margin-left: auto;
    margin-right: auto;
  }
  .button,
  .button-shadow {
    border: solid 1px #000;
    position: absolute;
    top: 0px;
    left: 0px;
    cursor: pointer;
    font-size: 0.9rem;
  }
  .button {
    padding: 7px 10px;
    background: #fff;
    z-index: 300;
    pointer-events: none;
  }
  .button-shadow {
    padding: 7px 10px;
    top: 5px;
    left: 4px;
    background: indianred;
    border: solid 1px indianred;
  }
  .button-shadow:hover {
    background: #000;
    border: solid 1px #000;
  }
</style>
