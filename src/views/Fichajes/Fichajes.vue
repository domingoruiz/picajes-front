<template>
    <DefaultLayout>
        <CRow>
            <CCol>
            <CCard class="mb-4">
                <CCardHeader> Fichajes </CCardHeader>
                <CCardBody>
                <CTable>
                    <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell scope="col" width="80px">#</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Fecha</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Equipo</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Usuario</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Tiempo trabajado</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Tiempo descansado</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Tiempo total</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
                    </CTableRow>
                    </CTableHead>
                    <CTableBody>
                    <CTableRow :key="fichaje" v-for="(fichaje, index) in fichajes">
                        <CTableHeaderCell scope="row">
                          {{index+1}}
                        </CTableHeaderCell>
                        <CTableDataCell>
                          {{fichaje.fch}}
                        </CTableDataCell>
                        <CTableDataCell>
                          {{fichaje.equipo}}
                        </CTableDataCell>
                        <CTableDataCell>
                          {{fichaje.usuario}}
                        </CTableDataCell>
                        <CTableDataCell>
                          {{fichaje.tim_trb}}
                        </CTableDataCell>
                        <CTableDataCell>
                          {{fichaje.tim_dsc}}
                        </CTableDataCell>
                        <CTableDataCell>
                          {{fichaje.tim_tot}}
                        </CTableDataCell>
                        <CTableDataCell>
                          <span v-if="fichaje.estado==1">Dentro</span>
                          <span v-if="fichaje.estado==2">Fuera</span>
                        </CTableDataCell>
                    </CTableRow>
                    </CTableBody>
                </CTable>
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
  name: 'Fichajes',
  data() {
    return {
      fichajes: [],
      errorCode: 0,
      errorText: ''
    }
  },
  components: {
    DefaultLayout
  },
  methods: {
    cargarfichajes: (self)  => {
        axios({
            method: 'GET',
            url: config.apiserver+"1.0/fichajes/",
            params: {
            token_sesion: VueCookies.get('token_sesion'),
            }
        })
        .then((response) => {
            self.fichajes = response.data.salida;
            self.errorCode = 200;
        })
        .catch((error) => {
            self.errorText = error.response.data.error;
            self.errorCode = error.response.status;
        });
    },
  },
  mounted() {
    this.cargarfichajes(this);
  }
}
</script>
