<template>
    <swiper :options="swiperOption" :not-next-tick="notNextTick" ref="mySwiper">
        <!-- slides -->
        <swiper-slide v-for="item in items" :key="item.id">
            <img :src="item.src">
            <!--<div class="swiper-lazy-preloader"></div>-->
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
</template>

<script>
  import { swiper, swiperSlide } from 'vue-awesome-swiper'

  export default {
    name: 'carrousel',
    components: {
      swiper,
      swiperSlide
    },
    props: {
      items: {
        type: Array,
        default: [],
        required: true,
      },
    },
    data () {
      return {
        notNextTick: true,
        swiperOption: {
          loop: true,
          autoplay: 5000,
          pagination: '.swiper-pagination',
          onTransitionStart (swiper) {
          }
        }
      }
    },
    computed: {
      swiper () {
        return this.$refs.mySwiper.swiper
      }
    },
    mounted () {
    }
  }
</script>
<style rel="stylesheet/less" lang="less">
    .swiper-container {
        height: 9.5rem;
        text-align: center;
        z-index: 0;
        img {
            width: 100%;
            height: 100%;
            max-width: 100%;
            max-height: 100%;
        }
        .swiper-wrapper {
            height: 9.5rem !important;
            z-index: 0;
        }
        .swiper-slide {
            /*margin: 0 1px;*/
            height: 100%;
        }
        .swiper-pagination-bullet {
            width: 8px;
            height: 8px;
            display: inline-block;
            border-radius: 100%;
            background: rgba(0, 0, 0, .1);
            border: 1px solid #FFFFFF;
        }
        .swiper-pagination-bullet-active {
            background-color: rgba(255, 255, 255, .8);
        }
        .swiper-pagination-bullets{
            text-align: right;
            padding-right: 15px;
        }
    }

</style>