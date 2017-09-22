<template>
    <div>
        <ul class="vue-countdown">
            <li>
                <p class="digit">{{ days | twoDigits }}</p>
                <p class="text">days</p>
            </li>
            <li>
                <p class="digit">{{ hours | twoDigits }}</p>
                <p class="text">hours</p>
            </li>
            <li>
                <p class="digit">{{ minutes | twoDigits }}</p>
                <p class="text">Min</p>
            </li>
            <li>
                <p class="digit">{{ seconds | twoDigits }}</p>
                <p class="text">Sec</p>
            </li>
        </ul>
        <div class="btn-group" style="width: 100%; text-align: center">
            <button class="btn btn-default" @click="stopAlarm()" style="float: none">Стоп</button>
        </div>
        <audio :src="audio"></audio>
    </div>
</template>

<script>
  import Vue from 'vue'
  import {Howl} from 'howler'

  Vue.filter('twoDigits', (value) => {
    if ( value.toString().length <= 1 ) {
      return '0'+value.toString()
    }
    return value.toString()
  })

  let interval = null;

  export default {
    props: ['deadline', 'audio'],
    data() {
      return {
        now: Math.trunc((new Date()).getTime() / 1000),
        date: null,
        diff: 0,
        alarm: {},
        stop: false
      }
    },
    mounted() {
      this.alarm = new Howl({
        src: [this.audio],
        loop: true
      })
      this.date = Math.trunc(Date.parse(this.deadline) / 1000)
      interval = setInterval(() => {
        this.now = Math.trunc((new Date()).getTime() / 1000)
      }, 1000)
      console.log(interval)
    },
    computed: {
      seconds() {
        return Math.trunc(this.diff) % 60
      },
      minutes() {
        return Math.trunc(this.diff / 60) % 60
      },
      hours() {
        return Math.trunc(this.diff / 60 / 60) % 24
      },
      days() {
        return Math.trunc(this.diff / 60 / 60 / 24)
      }
    },
    watch: {
      now(value){
        this.diff = this.date - this.now;
        if(this.diff <= 0 || this.stop){
          this.diff = 0;
          // Remove interval
          clearInterval(interval);
        }
      },
      diff(){
        if(this.diff === 0) {
          this.alarm.play()
        }
      }
    },
    methods: {
      stopAlarm() {
        this.stop = true
        this.alarm.stop()
        this.$parent.$data.active = false
      }
    }
  }
</script>
<style>
    @import url(https://fonts.googleapis.com/css?family=Roboto+Condensed:400|Roboto:100);
    .vue-countdown li {
        list-style: none;
        float: left;
    }
    .text {
        color: #1abc9c;
        font-size: 40px;
        font-family: 'Roboto Condensed', serif;
        font-weight: 400;
        margin-top:10px;
        margin-bottom: 10px;
        text-align: center;
    }
    .digit {
        color: #ecf0f1;
        font-size: 150px;
        font-weight: 100;
        font-family: 'Roboto', serif;
        margin: 10px;
        text-align: center;
    }
</style>