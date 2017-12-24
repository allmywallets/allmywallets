<template>
  <section>
    <article>
      <balance v-for="balance, key in balances" :key="key" :id="balance.id"></balance>
    </article>
  </section>
</template>

<script>
  import Balance from './balance.vue'

  export default {
    name: 'balance-list',
    components: {
      Balance
    },
    computed: {
      balances () {
        return this.$store.state.balances
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../scss/vars';

  article {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0 -10px;
  }
</style>
