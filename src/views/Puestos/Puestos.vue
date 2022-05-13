<template>
    <DefaultLayout>
        <CRow>
            <CCol>
            <CCard class="mb-4">
                <CCardHeader> <b>Puestos de fichaje</b> </CCardHeader>
                <CCardBody>
                <CTable>
                    <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell scope="col" width="80px">#</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Zona</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                    </CTableRow>
                    </CTableHead>
                    <CTableBody>
                    <CTableRow :key="puestofichaje" v-for="(puestofichaje, index) in puestosfichaje">
                        <CTableHeaderCell scope="row">
                          {{index+1}}
                        </CTableHeaderCell>
                        <CTableDataCell>
                          {{puestofichaje.zona}}
                        </CTableDataCell>
                        <CTableDataCell>
                          <router-link :to="`/puestosfichaje/${puestofichaje.id}`">{{puestofichaje.nombre}}</router-link>
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
                <CCardHeader> <b>Crear nuevo puesto de fichaje</b> </CCardHeader>
                <CCardBody>
                  <form>
                    <div v-if="(errorCode != 200) & (errorCode != 0)">
                      <div class="alert alert-danger" role="alert">{{ errorText }}</div>
                    </div>
                    <div class="mb-3">
                      <label class="form-label" for="nombre">Zona</label>
                      <SelectZonas @getZona="getZona" />
                    </div>
                    <div class="mb-3">
                      <label class="form-label" for="nombre">Nombre</label>
                      <CFormInput 
                        class="form-control" 
                        id="nombre" 
                        type="text" 
                        v-model:model-value="nombre"
                        v-on:keyup.enter="crearpuestofichaje(this)" />
                    </div>
                    <button class="btn btn-primary mb-3" type="submit" v-on:click="crearpuestofichaje(this)">Crear puesto de fichaje</button>
                  </form>
                </CCardBody>
            </CCard>
            </CCol>
        </CRow>
    </DefaultLayout>
</template>
<script>
import DefaultLayout from '@/layouts/DefaultLayout'
import SelectZonas from '@/components/SelectZonas'
import config from '@/config/config.js';
import axios from 'axios';
import VueCookies from 'vue-cookies';

export default {
  name: 'Puestos de fichaje',
  data() {
    return {
      puestosfichaje: [],
      nombre: '',
      zona: '',
      errorCode: 0,
      errorText: ''
    }
  },
  components: {
    DefaultLayout,
    SelectZonas
  },
  methods: {
    cargarpuestosfichaje: (self)  => {
        axios({
            method: 'GET',
            url: config.apiserver+"1.0/puestofichajes/",
            params: {
              token_sesion: VueCookies.get('token_sesion'),
            }
        })
        .then((response) => {
            self.puestosfichaje = response.data.salida;
            self.errorCode = 200;
        })
        .catch((error) => {
            self.errorText = error.response.data.error;
            self.errorCode = error.response.status;
        });
    },
    crearpuestofichaje: (self) => {
      if(self.zona != 0) {
        axios({
            method: 'POST',
            url: config.apiserver+"1.0/puestofichajes/?token_sesion="+VueCookies.get('token_sesion'),
            data: {
              nombre: self.nombre,
              zona: self.zona
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
            self.cargarpuestosfichaje(self);
          }
        }, 200);
      }
    },
    getZona(data) {
      this.zona = data;
    }
  },
  mounted() {
    this.cargarpuestosfichaje(this);
  }
}
</script>
