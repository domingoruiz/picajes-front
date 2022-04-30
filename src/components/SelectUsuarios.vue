<template>
  <select class="form-select" @change="setData($event)">
    <option value="0" selected>Elegir un usuario...</option>
    <option :key="usuario" v-for="(usuario) in usuarios" v-bind:value="usuario.id">
      {{usuario.nombre}}
    </option>
  </select>
</template>

<script>
import config from '@/config/config.js';
import axios from 'axios';
import VueCookies from 'vue-cookies';

export default {
  name: 'SelectUsuarios',
  data() {
    return {
      usuarios: []
    }
  },
  methods: {
    cargarusuarios: (self)  => {
        axios({
            method: 'GET',
            url: config.apiserver+"1.0/usuarios/",
            params: {
            token_sesion: VueCookies.get('token_sesion'),
            }
        })
        .then((response) => {
            self.usuarios = response.data.salida;
        });
    },
    setData(event) {
      this.$emit("getUsuario", event.target.value);
    }
  },
  mounted() {
    this.cargarusuarios(this);
    this.$emit("getUsuario", 0);
  }
}
</script>
