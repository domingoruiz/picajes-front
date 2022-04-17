<template>
  <select class="form-select" @change="setData($event)">
    <option value="0" selected>Elegir un equipo...</option>
    <option :key="equipo" v-for="(equipo) in equipos" v-bind:value="equipo.id">
      {{equipo.nombre}}
    </option>
  </select>
</template>

<script>
import config from '@/config/config.js';
import axios from 'axios';
import VueCookies from 'vue-cookies';

export default {
  name: 'SelectEquipos',
  data() {
    return {
      equipos: []
    }
  },
  methods: {
    cargarequipos: (self)  => {
        axios({
            method: 'GET',
            url: config.apiserver+"1.0/equipos/",
            params: {
            token_sesion: VueCookies.get('token_sesion'),
            }
        })
        .then((response) => {
            self.equipos = response.data.salida;
        });
    },
    setData(event) {
      this.$emit("getEquipo", event.target.value);
    }
  },
  mounted() {
    this.cargarequipos(this);
    this.$emit("getEquipo", 0);
  }
}
</script>
