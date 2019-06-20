<template>
  <div v-if="hotelData">
    <q-carousel
      swipeable
      animated
      v-model="slide"
      thumbnails
      infinite
    >
      <q-carousel-slide 
        v-for="(photo, index) in hotelData.photos"
        :key="index"
        :name="index"
        :img-src="photo.url"
      />
    </q-carousel>
    <q-page padding>
      <div class="text-h4 text-accent">
        {{hotelData.name}}
      </div>
      <q-badge
        class="q-mr-xs"
        v-for="(amenity, index) in hotelData.amenities"
        :key="index"
        color="accent"
      >
         {{amenity.name}}
      </q-badge>
      <div class="row min-height q-pt-sm">
        <div class="col-8">
          <p class="text-body1" v-html="hotelData.description"></p>
          <div v-for="(review, key) in hotelData.guest_reviews" :key="key">
            <div class="text-h6 text-accent">
              {{review.title}}
            </div>
            <q-rating v-model="review.rating" size="2em" color="accent" readonly/>
            <p class="text-body1" v-html="review.summary"></p>
          </div>
        </div>
        <div class="map-view col-4">
          <MapView
            :lat="hotelData.lat"
            :lng="hotelData.lng"
            :hotels="[hotelData]"
          />
        </div>
      </div>
    </q-page>

    <q-footer bordered class="bg-white text-black">
      <q-toolbar>
        <q-toolbar-title>
        </q-toolbar-title>
        <q-btn class="bg-accent text-white">Book hotel for {{roundTo(hotelData.nightly_rate)}}</q-btn>
      </q-toolbar>
    </q-footer>
  </div>
</template>

<script>
import MapView from "../components/MapView.vue";

export default {
  name: "detail",
  components: {
    MapView
  },
  data() {
    return {
      hotelData: null,
      slide: 1,
    }
  },
  computed: {
    // a computed getter
    search: function() {
      if(this.$route.query.q) {
        return this.$route.query.q;
      } else {
        return 'Charlottesville';
      }
    },
    arives: function() {
      if(this.$route.query.departs) {
        return this.$route.query.arives;
      } else {
        return '2019-08-14';
      }
    },
    departs: function() {
      if(this.$route.query.departs) {
        return this.$route.query.departs;
      } else {
        return '2019-08-29';
      }
    },
    hotelId: function() {
      if(this.$route.query.hotelId) {
        return this.$route.query.hotelId;
      } else {
        return '41hZL6G4Y04sAJ605g9krVMw';
      }
    }
  },
  async mounted() {
    await this.$axios.get(`http://localhost:3001/api/locations/${this.search.toLowerCase()}/hotels/${this.hotelId}?checkin=${this.arives}&checkout=${this.departs}`).then(response => {
      this.hotelData = response.data;
    });
  },
  methods: {
    roundTo(num){
      if(num) {
        return `$${num.toFixed(2)}`;
      } else {
        return "$ ---.--"
      }
    }
  }
}
</script>

<style>
.map-view {
  width: 100%;
  max-height: 300px;
}
.min-height {
  min-height:300px;
}
</style>
