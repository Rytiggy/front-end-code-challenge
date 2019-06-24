<template>
  <q-page>
    <q-header class="bg-white text-grey-9" bordered>
      <div class="row q-px-sm">
        <div class="col-xs-12 col-sm-12 col-md-8">
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
            outlined
            :rules="[val => !!val || 'Field is required']"
            class="q-py-sm input-branding"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">No results</q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="col-xs-9 col-sm-10 col-md-3">
          <q-input
            color="accent"
            square
            outlined
            v-model="arivalAndDepature"
            type="text"
            :rules="[val => !!val || 'Field is required']"
            class="q-py-sm input-branding"
          >
            <q-menu>
              <div class="row">
                <div class="col-6 q-pa-sm">
                  <div class="text-h6">Arives at {{arives}}</div>
                  <q-date v-model="arives" mask="YYYY-MM-DD" color="accent"/>
                </div>
                <div class="col-6 q-pa-sm">
                  <div class="text-h6">Departs at {{departs}}</div>
                  <q-date v-model="departs" mask="YYYY-MM-DD" color="accent"/>
                </div>
              </div>
            </q-menu>
          </q-input>
        </div>
        <div class="col-xs-3 col-sm-2 col-md-1">
          <q-btn class="fit" flat color="accent" label="Search" v-on:click="searchHotels"/>
        </div>
      </div>
    </q-header>

    <div class="row">
      <div class="col-sm-12 col-md-5">
        <div class="hotel-scroller">
          <q-list bordered separator>
            <q-item
              clickable
              v-for="(hotel, index) in hotels"
              :key="index"
              v-on:mouseover="selectHotel(hotel, index)"
              v-ripple="{ color: 'accent' }"
              :active="isActive(index)"
              active-class="text-accent"
            >
              <q-item-section thumbnail>
                <q-img :src="hotel.photos[0].url" spinner-color="white" :ratio="4/3"/>
                <q-rating :value="hotel.stars" size="2em" color="accent" readonly/>
              </q-item-section>
              <q-item-section top>
                <q-item-label class="text-h6">{{ hotel.name }}</q-item-label>
                <q-item-label class="text-grey-9" lines="2">{{hotel.short_description}}</q-item-label>
              </q-item-section>
              <q-item-section top side>
                <div
                  v-if="roundTo(hotel.nightly_rate)"
                  class="text-h6"
                >{{roundTo(hotel.nightly_rate)}}</div>
                <div v-else class>Not Available</div>
                <q-btn
                  flat
                  color="accent"
                  class="btn-bottom"
                  v-on:click="viewHotelDetails(hotel)"
                >View Booking</q-btn>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
      <div class="col-md-7 gt-sm">
        <MapView :lat="lat" :lng="lng" :hotels="hotels" @viewHotelDetails="viewHotelDetails"/>
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
      search: "Charlottesville",
      arives: "2019-08-14",
      departs: "2019-08-29",
      cities: [],
      hotels: [],
      lat: 38.04671096801758,
      lng: -78.48670196533203,
      selectedHotelIndex: 0
    };
  },
  mounted() {
    this.$axios
      .get("https://roomkey-api.herokuapp.com/api/locations/")
      .then(response => {
        this.mapData = response.data;
        this.cities = this.mapData.map(city => city.name);
      });
    //set URL prams to values
    if (
      this.$route.query.q ||
      this.$route.query.arives ||
      this.$route.query.arives
    ) {
      this.search = this.$route.query.q;
      this.arives = this.$route.query.arives;
      this.departs = this.$route.query.departs;
    }
    if (this.search || this.arives || this.departs) {
      this.searchHotels();
    }
  },
  computed: {
    // a computed getter
    arivalAndDepature: function() {
      // `this` points to the vm instance
      return `Arives: ${this.arives} - Departs: ${this.departs}`;
    }
  },
  watch: {
    // watch for input and set to URL prams
    search() {
      this.$router.push({
        path: "/",
        query: { ...this.$route.query, q: this.search }
      });
    },
    arives() {
      this.$router.push({
        path: "/",
        query: { ...this.$route.query, arives: this.arives }
      });
    },
    departs() {
      this.$router.push({
        path: "/",
        query: { ...this.$route.query, departs: this.departs }
      });
    }
  },
  methods: {
    filterFn(val, update) {
      setTimeout(() => {
        update(() => {
          if (val === "") {
            this.cities = this.mapData.map(city => city.name);
          } else {
            const needle = val.toLowerCase();
            this.cities = this.cities.filter(
              v => v.toLowerCase().indexOf(needle) > -1
            );
          }
        });
      }, 500);
    },
    abortFilterFn() {
      console.log("delayed filter aborted");
    },
    searchHotels() {
      if (
        this.search == "" ||
        !this.search ||
        this.arives == "" ||
        !this.arives ||
        this.departs == "" ||
        !this.departs
      ) {
        this.$q.notify({
          message: "Invalid search parameters",
          color: "negative"
        });
      } else {
        const url = `https://roomkey-api.herokuapp.com/api/locations/${this.search
          .toLowerCase()
          .replace(/\s/g, "")}/hotels?checkin=${this.arives}&checkout=${
          this.departs
        }`;
        this.$axios
          .get(url)
          .then(response => {
            this.hotels = response.data;
            this.selectHotel(this.hotels[0], 0);
          })
          .catch(() => {
            this.$q.notify({
              message: "No results found",
              color: "negative"
            });
          });
      }
    },
    isActive(index) {
      if (index === this.selectedHotelIndex) {
        return true;
      }
      return false;
    },
    selectHotel(hotel, index) {
      this.selectedHotelIndex = index;
      this.lat = hotel.lat;
      this.lng = hotel.lng;
    },
    viewHotelDetails(hotel) {
      let routeData = this.$router.resolve({
        path: "/detail",
        query: {
          ...this.$route.query,
          hotelId: hotel.id,
          q: this.search,
          arives: this.arives,
          departs: this.departs
        }
      });
      window.open(routeData.href, "_blank");
    },
    roundTo(num) {
      if (num) {
        return `$${num.toFixed(2)}`;
      } else {
        return false;
      }
    }
  }
};
</script>

<style scoped>
.hotel-scroller {
  height: calc(100vh - 50px);
  overflow: scroll;
}
.input-branding {
  font-size: 15px;
  color: #2981ca;
}

.btn-bottom {
  position: absolute;
  right: 5px;
  bottom: 5px;
}
</style>
