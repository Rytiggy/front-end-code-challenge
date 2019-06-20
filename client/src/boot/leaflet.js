import Vue from "vue";
import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

Vue.component("l-map", LMap);
Vue.component("l-tile-layer", LTileLayer);
Vue.component("l-marker", LMarker);
Vue.component("l-popup", LPopup);


delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  // eslint-disable-next-line no-undef
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  // eslint-disable-next-line no-undef
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  // eslint-disable-next-line no-undef
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});
