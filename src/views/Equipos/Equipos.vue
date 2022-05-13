<template>
    <DefaultLayout>
        <CRow>
            <CCol>
            <CCard class="mb-4">
                <CCardHeader> <b>Equipos</b> </CCardHeader>
                <CCardBody>
                <CTable>
                    <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell scope="col" width="80px">#</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                    </CTableRow>
                    </CTableHead>
                    <CTableBody>
                    <CTableRow :key="equipo" v-for="(equipo, index) in equipos">
                        <CTableHeaderCell scope="row">
                          {{index+1}}
                        </CTableHeaderCell>
                        <CTableDataCell>
                          <router-link :to="`/equipos/${equipo.id}`">{{equipo.nombre}}</router-link>
                        </CTableDataCell>
                    </CTableRow>
                    </CTableBody>
                </CTable>
                </CCardBody>
            </CCard>
            </CCol>
        </CRow>
        <CRow>
            <CCol>
            <CCard class="mb-4">
                <CCardHeader> <b>Crear nuevo equipo</b> </CCardHeader>
                <CCardBody>
                  <form>
                    <div v-if="(errorCode != 200) & (errorCode != 0)">
                      <div class="alert alert-danger" role="alert">{{ errorText }}</div>
                    </div>
                    <div class="mb-3">
                      <label class="form-label" for="nombre">Nombre</label>
                      <CFormInput 
                        class="form-control" 
                        id="nombre" 
                        type="text" 
                        v-model:model-value="nombre"
                        v-on:keyup.enter="crearequipo(this)" />
                    </div>
                    <button class="btn btn-primary mb-3" type="submit" v-on:click="crearequipo(this)">Crear equipo</button>
                  </form>
                </CCardBody>
            </CCard>
            </CCol>
        </CRow>
    </DefaultLayout>
</template>
<script>
import DefaultLayout from '@/layouts/DefaultLayout'
import config from '@/config/config.js';
import axios from 'axios';
import VueCookies from 'vue-cookies';

export default {
  name: 'equipos',
  data() {
    return {
      equipos: [],
      nombre: '',
      errorCode: 0,
      errorText: '',
      i: 0
    }
  },
  components: {
    DefaultLayout
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
            self.errorCode = 200;
        })
        .catch((error) => {
            self.errorText = error.response.data.error;
            self.errorCode = error.response.status;
        });
    },
    crearequipo: (self) => {
      axios({
          method: 'POST',
          url: config.apiserver+"1.0/equipos/?token_sesion="+VueCookies.get('token_sesion'),
          data: {
            nombre: self.nombre
          },
          crossdomain: true,
      })
      .then(() => {
        self.errorCode = 200;
      })
      .catch((error) => {
        self.errorText = error.response.data.error;
        self.errorCode = error.response.status;
      });

      setTimeout(function () {
        if(self.errorCode == 200) {
          self.errorText = '';
          self.nombre = "";
          self.cargarequipos(self);
        }
      }, 200);
    },
  },
  mounted() {
    this.cargarequipos(this);
  }
}
</script>
