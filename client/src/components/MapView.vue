<template>
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
      </l-marker>    
      <l-marker v-for="(hotel, hotelIndex) in hotels" :key="hotelIndex" :lat-lng="[hotel.lat, hotel.lng]">
        <l-popup>
          <div class="row">
            <div class="col-12 text-center">
              <q-img :src="hotel.photos[0].url" spinner-color="white" :ratio="4/3">
              </q-img>
            </div>
            <div class="col-12 q-px-sm">
              <a href="#">
                <div class="text-h6 text-accent ellipsis" v-on:click="viewHotelDetails(hotel)">
                  {{ hotel.name }}
                </div>
              </a>
            </div>
            <div class="col-12 q-px-sm text-right">
              <div v-if="roundTo(hotel.nightly_rate)" class="text-h6">
                {{roundTo(hotel.nightly_rate)}}
              </div>
              <div v-else class="text-h6">
                Not Available
              </div>
            </div>
          </div>
        </l-popup>
      </l-marker>
    </l-map>
  </div>
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
        return false;
      }
    },
    viewHotelDetails(hotel) {
      this.$emit('viewHotelDetails', hotel)
    }
  }
}
</script>