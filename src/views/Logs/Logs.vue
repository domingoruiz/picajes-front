<template>
    <DefaultLayout>
        <CRow>
            <CCol>
            <CCard class="mb-4">
                <CCardHeader> Logs </CCardHeader>
                <CCardBody>
                <CTable>
                    <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell scope="col" width="80px">#</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Tipo</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Fecha / Hora</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Puesto</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Usuario</CTableHeaderCell>
                    </CTableRow>
                    </CTableHead>
                    <CTableBody>
                    <CTableRow :key="log" v-for="(log, index) in logs">
                        <CTableHeaderCell scope="row">
                          {{index+1}}
                        </CTableHeaderCell>
                        <CTableDataCell>
                          <span v-if="log.tipo_movimiento==1">Entrada</span>
                          <span v-if="log.tipo_movimiento==2">Salida</span>
                        </CTableDataCell>
                        <CTableDataCell>
                          {{log.alt_date}}
                        </CTableDataCell>
                        <CTableDataCell>
                          {{log.puesto_fichaje}}
                        </CTableDataCell>
                        <CTableDataCell>
                          {{log.usuario}}
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
  name: 'Logs',
  data() {
    return {
      logs: [],
      errorCode: 0,
      errorText: ''
    }
  },
  components: {
    DefaultLayout
  },
  methods: {
    cargarlogs: (self)  => {
        axios({
            method: 'GET',
            url: config.apiserver+"1.0/logs/",
            params: {
            token_sesion: VueCookies.get('token_sesion'),
            }
        })
        .then((response) => {
            self.logs = response.data.salida;
            self.errorCode = 200;
        })
        .catch((error) => {
            self.errorText = error.response.data.error;
            self.errorCode = error.response.status;
        });
    },
  },
  mounted() {
    this.cargarlogs(this);
  }
}
</script>
