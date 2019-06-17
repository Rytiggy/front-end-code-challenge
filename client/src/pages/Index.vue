<template>
  <q-page class="flex flex-center">
    <img alt="Quasar logo" src="~assets/quasar-logo-full.svg" />
    {{info}}
  </q-page>
</template>

<style></style>

<script>
export default {
  name: "PageIndex",
  data () {
    return {
      info: null
    }
  },
  mounted () {
    this.$axios
      .get("localhost:3000/api/locations/")
      .then(response => (this.info = response));
  }
};
</script>
