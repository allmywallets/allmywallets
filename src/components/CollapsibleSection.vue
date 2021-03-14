<template>
  <section :class="{ collapsible: true, expanded: expanded }">
    <header class="collapsible-header">
      <h3 class="collapsible-title">
        <fa-icon :icon="icon" v-if="icon !== ''" class="icon" />
        <slot name="title">Section title</slot>
        <a
          class="button button-small expand-button"
          @click.prevent="expanded = !expanded"
          href="#"
          v-if="this.$slots.default"
        >
          <translate v-if="expanded" key="text-collapse">Collapse</translate>
          <translate v-else key="text-expand">Expand</translate>
        </a>
      </h3>
      <slot name="intro">Section intro</slot>
    </header>
    <article class="collapsible-content">
      <slot>Section content</slot>
    </article>
  </section>
</template>

<script>
export default {
  name: "collapsible-section",
  props: {
    icon: {
      type: String,
      required: false,
      default: ""
    }
  },
  data() {
    return {
      expanded: false
    }
  }
}
</script>

<style scoped lang="scss">
@import "../assets/scss/vars";

.collapsible {
  padding: 5px 15px 15px;
  margin-bottom: 10px;
  @include card();

  &.warning {
    border-left: 3px solid $color-warning;
  }

  .collapsible-header {
    p:last-child {
      margin-bottom: 0;
    }

    .icon {
      width: 20px;
      margin-right: 10px;
    }

    .expand-button {
      margin-left: 5px;
    }
  }

  .collapsible-content {
    max-height: 0;
    overflow: hidden;
  }

  &.expanded .collapsible-content {
    max-height: none;
    padding: 15px 0 0;
  }
}
</style>
