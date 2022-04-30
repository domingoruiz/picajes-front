<template>
    <DefaultLayout>
        <CRow>
            <CCol>
            <CCard class="mb-4">
                <CCardHeader> Fichajes </CCardHeader>
                <CCardBody>
                <form class="form-inline">
                    <div>
                      <div class="form-group" style="display: inline;">
                      <button 
                      class="btn btn-primary" 
                      type="submit" 
                      v-on:click="cargarfichajes(this)" 
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
                        <label class="form-label mb-2" for="nombre" style="width: 110px">Equipo</label>
                        <SelectEquipos @getEquipo="getEquipo" v-bind:value="equipo" class="form-control mb-2" style="width: 170px; display: inline; margin-left: 15px"/>
                      </div>
                      <br>
                      <div class="form-group" style="display: inline; margin-left: 88px">   
                        <label class="form-label mb-2" for="nombre" style="width: 110px">Usuario</label>
                        <SelectUsuarios @getUsuario="getUsuario" v-bind:value="usuario" class="form-control mb-2" style="width: 170px; display: inline; margin-left: 15px"/>
                      </div>
                      <div class="form-group" style="display: inline; margin-left: 15px">   
                        <label class="form-label mb-2" for="nombre" style="width: 110px">Estado</label>
                        <select v-model="estado" class="form-control mb-2" style="width: 170px; display: inline; margin-left: 15px" >
                          <option value="0" selected>Elegir un estado...</option>
                          <option value="1">Dentro</option>
                          <option value="2">Fuera</option>
                        </select>
                      </div> 
                    </div>
                  </form>
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
import SelectEquipos from '@/components/SelectEquipos'
import SelectUsuarios from '@/components/SelectUsuarios'
import config from '@/config/config.js';
import axios from 'axios';
import VueCookies from 'vue-cookies';

export default {
  name: 'Fichajes',
  data() {
    return {
      fichajes: [],
      errorCode: 0,
      errorText: '',
      fch_ini: '',
      fch_fin: '',
      equipo: 0,
      usuario: 0,
      estado: 0
    }
  },
  components: {
    DefaultLayout,
    SelectEquipos,
    SelectUsuarios
  },
  methods: {
    cargarfichajes: (self)  => {
        axios({
            method: 'GET',
            url: config.apiserver+"1.0/fichajes/",
            params: {
            token_sesion: VueCookies.get('token_sesion'),
            fch_ini: self.fch_ini,
            fch_fin: self.fch_fin,
            equipo: self.equipo,
            usuario: self.usuario,
            estado: self.estado
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
    getEquipo(data) {
      this.equipo = data;
    },
    getUsuario(data) {
      this.usuario = data;
    },
  },
  mounted() {
    this.cargarfichajes(this);
    this.fch_ini = new Date().toISOString().split('T')[0];
    this.fch_fin = new Date().toISOString().split('T')[0];
  }
}
</script>
