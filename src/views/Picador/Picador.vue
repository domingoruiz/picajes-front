<template>
  <div>
    <div class="wrapper d-flex flex-column min-vh-100 bg-light">
      <CHeader position="sticky" class="mb-4">
        <CContainer fluid> 
          <CHeaderBrand class="mx-auto d-lg-none" to="/">
            <h3>Picajes</h3>
          </CHeaderBrand>
        </CContainer>
      </CHeader>
      <div class="body flex-grow-1 px-3">
          <h1 class="text-center" width="100%">{{date}}</h1>
          <br>
          <br>
          <h3 class="text-center" width="100%">Pase la tarjeta por el lector para registrar la entrada / salida</h3>
          <br>
          <div v-if="(errorCode != 0) & (errorCode != 200)">
            <div class="alert alert-danger" role="alert" style="text-align: center"><h3>{{ errorText }}</h3></div>
          </div>
          <div v-if="(errorCode == 200)">
            <div class="alert alert-success" role="alert" style="text-align: center"><h3>{{ errorText }}</h3></div>
          </div>
          <input 
            v-if="bloqueado != 1"
            ref="barcode"
            type="number" 
            v-model="barcode"
            v-on:keyup.enter="picar(this)" 
            style="position: fixed; bottom: 0px; margin-bottom: 48px; margin-right: 500px; width: 96%"
            />
      </div>
      <AppFooter />
      <p style="position: fixed; bottom: 0px; margin-bottom: 80px; margin-left: 17px; width: 90%;">{{nombreEmpresa}} - {{nombrePuesto}}</p>
    </div>
  </div>
</template>
<script>
import { CContainer } from '@coreui/vue'
import AppFooter from '@/components/AppFooter.vue'
import config from '@/config/config.js';
import axios from 'axios';
import VueCookies from 'vue-cookies';

export default {
  name: 'Picador',
  data() {
    return {
      barcode: '',
      empresa: this.$route.params.empresa,
      puesto: this.$route.params.puesto,
      errorCode: 0,
      errorText: '',
      date: '',
      bloqueado: 1,
      nombreEmpresa: '',
      nombrePuesto: ''
    }
  },
  components: {
    AppFooter,
    CContainer,
  },
  methods: {
    currentDate() {
      const current = new Date();
      this.date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()} ${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}`;
    },
    picar(self) {
      axios({
          method: 'POST',
          url: config.apiserver+"1.0/logs/?token_sesion="+VueCookies.get('token_sesion'),
          data: {
            barcode: self.barcode,
            puesto_fichaje: self.puesto,
            empresa: self.empresa
          },
          crossdomain: true,
      })
      .then((response) => {
        self.errorCode = 200;
        self.errorText = response.data.error;
      })
      .catch((error) => {
        self.errorText = error.response.data.error;
        self.errorCode = error.response.status;
      });
      self.barcode="";
      window.setTimeout(() => {
          self.errorText = "";
          self.errorCode = "";
      },4000);
    }
  },
  created() {
    this.$nextTick(function () {
            window.setInterval(() => {
                this.currentDate();
            },1000);
        });
  },
  mounted() {
    axios({
          method: 'GET',
          url: config.apiserver+"1.0/empresas/"+this.empresa+"/?token_sesion="+VueCookies.get('token_sesion'),
          data: {
            token_sesion: VueCookies.get('token_sesion'),
          },
          crossdomain: true,
      })
      .then((response) => {
        this.errorText = response.data.error;
        this.nombreEmpresa = response.data.salida.nombre;
        this.bloqueado = 0;
      })
      .catch((error) => {
        this.errorText = error.response.data.salida.error;
        this.errorCode = error.response.status;
        this.bloqueado = 1;
      });

    axios({
          method: 'GET',
          url: config.apiserver+"1.0/puestofichajes/"+this.puesto+"/?token_sesion="+VueCookies.get('token_sesion'),
          data: {
            token_sesion: VueCookies.get('token_sesion'),
          },
          crossdomain: true,
      })
      .then((response) => {
        this.errorText = response.data.error;
        this.nombrePuesto = response.data.salida.nombre;
        this.bloqueado = 0;
      })
      .catch((error) => {
        this.errorText = error.response.data.error;
        this.errorCode = error.response.status;
        this.bloqueado = 1;
      });

    if(this.bloqueado == 0) {
      this.currentDate();
      this.$refs.barcode.focus();
    }
  }
}
</script>
