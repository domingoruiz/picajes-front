<template>
  <select class="form-select" @change="setData($event)">
    <option value="0" selected>Elegir una zona...</option>
    <option :key="zona" v-for="(zona) in zonas" v-bind:value="zona.id">
      {{zona.nombre}}
    </option>
  </select>
</template>

<script>
import config from '@/config/config.js';
import axios from 'axios';
import VueCookies from 'vue-cookies';

export default {
  name: 'SelectZonas',
  data() {
    return {
      zonas: []
    }
  },
  methods: {
    cargarzonas: (self)  => {
        axios({
            method: 'GET',
            url: config.apiserver+"1.0/zonas/",
            params: {
            token_sesion: VueCookies.get('token_sesion'),
            }
        })
        .then((response) => {
            self.zonas = response.data.salida;
        });
    },
    setData(event) {
      this.$emit("getZona", event.target.value);
    }
  },
  mounted() {
    this.cargarzonas(this);
    this.$emit("getZona", 0);
  }
}
</script>
