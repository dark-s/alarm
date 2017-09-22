<template>
  <div id="wrapper">
    <div v-if="!active">
      <div class="add-audio">
        <div class="form-group">
          <button class="btn btn-default select-file" @click="selectAudio()" style="width: 100%">Добавить трек</button>
        </div>
      </div>
      <div class="date-picker">
        <div class="form-group">
          <label for="date">Выберите дату и время</label>
          <date-picker id="date" class="date-picker" :config="dateConfig" v-model="date"></date-picker>
        </div>
      </div>
      <div class="select-audio">
        <div class="form-group">
          <label for="select-audio">Выберите песню</label>
          <select class="form-control" id="select-audio" v-model="file" style="width: 100%">
            <option value="" v-if="files.length === 0">-- Добавьте песню --</option>
            <option value="" v-else>-- Выберите песню --</option>
            <option :value="file" v-for="file in files">{{ file }}</option>
          </select>
        </div>
      </div>
      <div class="btn-group col-sm-12 text-center">
        <button class="btn btn-default" :disabled="(new Date(date).getTime() < new Date().getTime())" @click="startAlarm()" style="float: none">Завести будильник</button>
      </div>
    </div>
    <countdown :deadline="date" :audio="audioPath" v-else></countdown>
  </div>
</template>

<script>
  import Countdown from './Includes/Countdown.vue';
  import datePicker from 'vue-bootstrap-datetimepicker'
  const dialog = require('electron').remote.dialog
  const moment = require('moment')
  const path = require('path')
  const fs = require('fs-extra')

  export default {
    data() {
      return {
        active: false,
        date: new Date(),
        files: '',
        file: '',
        valid: false,
        dateConfig: {
          locale: moment.locale('ru')
        }
      }
    },
    components: {
      Countdown,
      datePicker
    },
    computed: {
      audioPath() {
        let audioPath = path.resolve('audio')
        return  path.join(audioPath, this.file)
      }
    },
    mounted() {
      if(fs.existsSync('audio'))
        this.files = fs.readdirSync('audio')
    },
    methods: {
      updateAudioList() {
        this.files = fs.readdirSync('audio')
      },
      selectAudio() {
        dialog.showOpenDialog({
          title: 'Выберите аудио',
          filters: [
            {name: 'Audio', extensions: ['mp3']}
          ]
        }, function (filePath) {
          if(typeof filePath === 'undefined') return false
          let fileName = path.basename(filePath[0])
          fs.copySync(filePath[0], 'audio/' + fileName)
          this.updateAudioList()
        }.bind(this))
      },
      startAlarm() {
        this.active = true
      }
    }
  }
</script>

<style>
  #wrapper{
    align-items: center;
    bottom: 0;
    background-color: #34495e;
    display: flex;
    justify-content: center;
    left: 0;
    position: absolute;
    right: 0;
    top:0;
  }
  .add-audio {
    position: absolute;
    top:15px;
    right: 15px;
  }
  #wrapper label {
    color: #fff;
  }
</style>