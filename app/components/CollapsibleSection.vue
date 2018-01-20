<template>
  <section :class="{ 'collapsible': true, 'expanded': expanded }">
    <header class="collapsible-header">
      <h3 class="collapsible-title">
        <slot name="title" />
        <a class="button button-small" @click.prevent="expanded = !expanded" href="#" v-if="this.$slots.default">
          <fa-icon :icon="expanded ? 'compress' : 'expand'" />
          <translate v-if="expanded">Collapse</translate>
          <translate v-else>Expand</translate>
        </a>
      </h3>
      <slot name="intro" />
    </header>
    <article class="collapsible-content">
      <slot />
    </article>
  </section>
</template>

<script>
  export default {
    name: 'collapsible-section',
    data () {
      return {
        expanded: false
      }
    }
  }
</script>

<style scoped lang="scss">
  .collapsible {
    background: white;
    border-radius: 3px;
    padding: 5px 15px 0;
    margin-bottom: 10px;

    .collapsible-header p:last-child {
      margin-bottom: 0;
    }

    .collapsible-content {
      max-height: 0;
      overflow: hidden;
      margin-top: 15px;
    }

    &.expanded .collapsible-content {
      max-height: none;
    }
  }
</style>
