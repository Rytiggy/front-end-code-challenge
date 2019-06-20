<template>
  <!-- <div style="height: 100%; width: 100%"> -->
    <!-- <div class="info" style="height: 15%">
      <span>Center: {{ center }}</span>
      <span>Zoom: {{ zoom }}</span>
      <span>Bounds: {{ bounds }}</span>
    </div> -->
    <div class="full-height">
      <l-map
        class="fit"
        :zoom="zoom"
        :center="[lat, lng]"
        @update:zoom="zoomUpdated"
        @update:center="centerUpdated"
        @update:bounds="boundsUpdated"
      >
        <l-tile-layer :url="url"></l-tile-layer>
        <l-marker :lat-lng="[lat, lng]">
          <l-popup>Hello!</l-popup>
        </l-marker>    
        <l-marker v-for="(hotel, hotelIndex) in hotels" :key="hotelIndex" :lat-lng="[hotel.lat, hotel.lng]">
          <l-popup>
            <b>{{ hotel.name }}</b> 
            <span v-if="hotel.nightly_rate"> {{roundTo(hotel.nightly_rate)}}</span>
          </l-popup>
        </l-marker>
      </l-map>
    </div>
  <!-- </div> -->
</template>

<script>

export default {
  props: ["lat","lng", "hotels"],
  data () {
    return {
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      zoom: 15,
      bounds: null
    };
  },
  methods: {
    zoomUpdated (zoom) {
      this.zoom = zoom;
    },
    centerUpdated (center) {
      this.center = center;
    },
    boundsUpdated (bounds) {
      this.bounds = bounds;
    },
    roundTo(num){
      if(num) {
        return `$${num.toFixed(2)}`;
      } else {
        return "$---.--"
      }
    }
  }
}
</script>