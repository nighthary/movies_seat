<template>
    <div class="vue-count">
        <button class="vue-count-control vue-count-sub" type="button"
                @click.stop.prevent="min_us" ></button>
        <input class="vue-count-current_" type="tel" v-model="current_" number lazy
               @keydown="onKeydown" @focus="onFocus" @change="onChange" @blur="onBlur">
        <button class="vue-count-control vue-count-add" type="button"
                @click.stop.prevent="add" ></button>
    </div>
</template>

<script>
  export default {
    props: {
      current: {
        type: Number,
        required: true,
        twoWay: true,
        default: 0
      },

      limit: {
        type: Number
      },

      min: {
        type: Number,
        default: 0
      },

      max: {
        type: Number,
        default: Infinity
      },
      countChange: {
        type: Function,
        default: () => {},
      }
    },
    data () {
      return {
        current_: 1,
        limit_: 999999999,
        min_: 1,
        max_: 999999999,
        previousValue: 1
      };
    },
    methods: {
      add: function() {
        if(this.current_ < this.max_) {
          this.current_++;
          this.limit_ = this.limit_ - 1;
        }
        this.countChange(this.current_)
      },

      min_us: function() {
        if(this.current_ > this.min_) {
          this.current_--;
          this.limit_ = this.limit_ + 1;
        }
        this.countChange(this.current_)
      },

      onKeydown: function(event) {
        var code = event.keyCode;

        if(!((code >= 48 && code <= 58) ||
            code === 8 || code === 9 || code === 13)) {
          event.preventDefault();
        }
      },

      onFocus: function() {
        this.previousValue = this.current_;
      },

      onChange: function() {
        if(this.current_ > this.limit_) {
          this.current_ = this.previousValue + this.limit_;
          this.limit_ = 0;
        }

        if(this.current_ > this.max_) {
          this.limit_ = this.current_ - this.max_;
          this.current_ = this.max_;
        }
        this.countChange(this.current_)
      },
      onBlur (e) {
        let value = e.currentTarget.value

        if(!value){
          this.current_ = 1
        }
        this.countChange(this.current_)
      }
    }
  };
</script>
<style lang="css">
    .vue-count {
        display: flex;
        align-items: center;
        border-radius: .06rem;
        height: 100%;
    }

    .vue-count-control {
        width: 1.875rem;
        height: 1.4rem;
        display: block;
        outline: none;
        border: none;
    }

    .vue-count-control[disabled] {
        color: #999;
    }

    .vue-count-current_ {
        outline: none;
        text-align: center;
        display: block;
        height: 100%;
        line-height: 1rem;
        width: 3.125rem;
        border:none;
        background: none;
        font-size: 1rem;
        position: relative;
    }
    .vue-count-sub{
        background-image: url("./img/icon_sub.png");
        background-size: 100% 100%;
        position: relative;
    }
    .vue-count-add{
        background-image: url("./img/icon_add.png");
        background-size: 100% 100%;
    }
    .vue-count-sub::after{
        position: absolute;
        content: '';
        top: -13px;
        width: 40px;
        right: 0;
        height: 48px;
    }
    .vue-count-add::after{
        position: absolute;
        content: '';
        top: 0;
        width: 40px;
        right: -10px;
        height: 100%;
    }
</style>