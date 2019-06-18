<template>
  <q-page>
    <div class="row window-height">
      <div class="col-4">
        <div class="row bordered">
          <div class="col-12">
            <q-select
              v-model="search"
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              label="Search"
              :options="cities"
              @filter="filterFn"
              @filter-abort="abortFilterFn"
              color="accent"
              square
              class="q-pa-sm"
              :rules="[val => !!val || 'Field is required']"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-12">
            <q-input
              color="accent"
              square
              v-model="arives"
              type="date"
              class="q-pa-sm"
              :rules="[val => !!val || 'Field is required']"
            />
          </div>
          <div class="col-12">
            <q-input
              color="accent"
              square
              v-model="departs"
              type="date"
              class="q-pa-sm"
              :rules="[val => !!val || 'Field is required']"
            />
          </div>
          <div class="col-12">
            <q-btn
              class="fit"
              flat
              color="accent"
              label="Search"
              v-on:click="searchHotels"
            />
          </div>
        </div>
        <div class="hotel-scroller">
          <div v-for="(hotel, index) in hotels" :key="index" >
            <!-- {{hotel}} -->
            <div
              v-ripple="{ color: 'accent' }"
              class="relative-position q-pa-md cursor-pointer"
              v-on:click="selectHotel(hotel)"
            >
              <div class="text-h6 text-accent">{{ hotel.name }}</div>
              {{ hotel.short_description }}
            </div>
              <q-separator inset />
          </div>
        </div>
      </div>
      <div class="col-8">
        <MapView :lat="lat" :lng="lng"/>
      </div>
    </div>
  </q-page>
</template>

<style></style>

<script>
import MapView from "../components/MapView.vue";

export default {
  name: "PageIndex",
  components: {
    MapView
  },
  data() {
    return {
      mapData: [],
      search: "",
      arives: "",
      departs: "",
      cities: [],
      hotels: [],
      lat: 38.04671096801758,
      lng: -78.48670196533203
    };
  },
  mounted() {
    this.$axios
      .get("http://localhost:3001/api/locations/")
      .then(response => {
        this.mapData = response.data;
        this.cities = this.mapData.map(city => city.name);
      });
    //set URL prams to values  
    this.search = this.$route.query.q;
    this.arives = this.$route.query.arives;
    this.departs = this.$route.query.departs;
    if(  this.search
      || this.arives
      || this.departs)
    {
      this.searchHotels() 
    }
  },
  watch: {
    // watch for input and set to URL prams 
    search() {
      this.$router.push({
        path: '/',
        query: { ...this.$route.query, q: this.search },
      });
    },
    arives() {
      this.$router.push({
        path: '/',
        query: { ...this.$route.query, arives: this.arives },
      });
    },
    departs() {
      this.$router.push({
        path: '/',
        query: { ...this.$route.query, departs: this.departs },
      });
    },
  },
  methods: {
    filterFn (val, update) {
      setTimeout(() => {
        update(() => {
          if (val === '') {
            this.cities = this.mapData.map(city => city.name);
          }
          else {
            const needle = val.toLowerCase()
            this.cities = this.cities.filter(v => v.toLowerCase().indexOf(needle) > -1)
          }
        })
      }, 500)
    },
    abortFilterFn () {
      console.log('delayed filter aborted')
    },
    searchHotels() {
      if(this.search == "" || !this.search || this.arives == "" || !this.arives || this.departs == "" || !this.departs) {
        this.$q.notify({
          message: 'Invalid search parameters',
          color: 'negative'
        });
      } else {
        const url = `http://localhost:3000/api/locations/${this.search.toLowerCase()}/hotels?checkin=${this.arives}&checkout=${this.departs}`;
        this.$axios.get(url).then(response => {
          this.hotels = response.data;
          this.selectHotel(this.hotels[0])
        }).catch(() => {
          this.$q.notify({
            message: 'No results found',
            color: 'negative'
          });
        });
      }
    },
    selectHotel(hotel) {
      this.lat = hotel.lat;
      this.lng = hotel.lng;
    }
  }
};
</script>

<style>
.hotel-scroller {
  height: calc(100vh - 252px);
  overflow: scroll;
}
</style>
