<template>
  <div>
    <fa-icon
      icon="wifi"
      :class="{ 'text-danger': !online }"
      :title="getTitle()"
      v-tippy="{ showOnLoad: !online }"
    />
  </div>
</template>

<script>
export default {
  name: "indicator-online",
  data() {
    return {
      online: navigator.onLine
    }
  },
  mounted() {
    window.addEventListener("offline", () => {
      this.online = false
    })
    window.addEventListener("online", () => {
      this.online = true
    })
  },
  methods: {
    getTitle() {
      return this.online ? "App is online" : "App is offline"
    }
  }
}
</script>
