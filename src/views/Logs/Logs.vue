<template>
    <DefaultLayout>
        <CRow>
            <CCol>
            <CCard class="mb-4">
                <CCardHeader> Logs </CCardHeader>
                <CCardBody>
                  <form class="form-inline">
                    <div>
                      <div class="form-group" style="display: inline;">
                      <button 
                      class="btn btn-primary" 
                      type="submit" 
                      v-on:click="cargarlogs(this)" 
                      placeholder="DD/MM/YY">
                        Buscar
                      </button> 
                      </div>
                      <div class="form-group" style="display: inline; margin-left: 15px">
                        <label class="form-label mb-2" for="nombre" style="width: 110px">Fecha de inicio</label>
                        <input type="date" class="form-control mb-2" id="fch_ini" v-model="fch_ini" style="width: 170px; display: inline; margin-left: 15px"/>
                      </div>
                      <div class="form-group" style="display: inline; margin-left: 15px"> 
                        <label class="form-label mb-2" for="nombre" style="width: 110px">Fecha de fin</label>
                        <input type="date" class="form-control mb-2" id="fch_fin" v-model="fch_fin" style="width: 170px; display: inline; margin-left: 15px"/>
                      </div>
                      <div class="form-group" style="display: inline; margin-left: 15px">   
                        <label class="form-label mb-2" for="nombre" style="width: 110px">Usuario</label>
                        <SelectUsuarios @getUsuario="getUsuario" v-bind:value="usuario" class="form-control mb-2" style="width: 170px; display: inline; margin-left: 15px"/>
                      </div>
                    </div>
                  </form>
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
import SelectUsuarios from '@/components/SelectUsuarios'
import config from '@/config/config.js';
import axios from 'axios';
import VueCookies from 'vue-cookies';

export default {
  name: 'Logs',
  data() {
    return {
      logs: [],
      errorCode: 0,
      errorText: '',
      fch_ini: '',
      fch_fin: '',
      usuario: 0,
    }
  },
  components: {
    DefaultLayout,
    SelectUsuarios
  },
  methods: {
    cargarlogs: (self)  => {
        axios({
            method: 'GET',
            url: config.apiserver+"1.0/logs/",
            params: {
            token_sesion: VueCookies.get('token_sesion'),
            fch_ini: self.fch_ini,
            fch_fin: self.fch_fin,
            usuario: self.usuario,
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
    getUsuario(data) {
      this.usuario = data;
    },
  },
  mounted() {
    this.cargarlogs(this);
  }
}
</script>
