<!--
    大小分三种
    最大 size='large'     40*40
    中等 size='middling'  30*30
    最小 size='small'     20*20
    是否全屏显示 isFullScreen=false    默认为否
-->
<template>
    <div :class="{'fixed-fullscreen':isFullScreen}" v-show="isShow">
        <div class="sk-fading-circle"
             :class="{
                    large : size === 'large',
                    small:size==='small',
                    middling:size==='middling',
                    white:color==='white',
                    black:color==='black'
            }">
            <div class="sk-circle1 sk-circle-ios"></div>
            <div class="sk-circle2 sk-circle-ios"></div>
            <div class="sk-circle3 sk-circle-ios"></div>
            <div class="sk-circle4 sk-circle-ios"></div>
            <div class="sk-circle5 sk-circle-ios"></div>
            <div class="sk-circle6 sk-circle-ios"></div>
            <div class="sk-circle7 sk-circle-ios"></div>
            <div class="sk-circle8 sk-circle-ios"></div>
            <div class="sk-circle9 sk-circle-ios"></div>
            <div class="sk-circle10 sk-circle-ios"></div>
            <div class="sk-circle11 sk-circle-ios"></div>
            <div class="sk-circle12 sk-circle-ios"></div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            size: {
                type: String,
                default: 'large',
            },
            isShow: {
                type: Boolean,
                default: true,
            },
            isFullScreen: {
                type: Boolean,
                default: false,
            },
            color: {
                type: String,
                default: 'black',
            }

        },
    }
</script>

<style rel="stylesheet/less" lang="less">

    .fixed-fullscreen {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 999;
        .sk-fading-circle {
            left: 50%;
            top: 50%;
            position: absolute;
        }
        .large {
            margin: -20px 0 0 -20px;
        }

        .middling {
            margin: -15px 0 0 -15px;
        }

        .small {
            margin: -10px 0 0 -10px;
        }
    }

    .sk-fading-circle {
        position: relative;
        display: inline-block;
    }

    .large {
        width: 40px;
        height: 40px;
    }

    .middling {
        width: 30px;
        height: 30px;
    }

    .small {
        width: 20px;
        height: 20px;
    }

    .sk-fading-circle .sk-circle-ios {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }

    .sk-fading-circle .sk-circle-ios:before {
        content: '';
        display: block;
        margin: 0 auto;
        border-radius: 1px;
        width: 5%;
        height: 25%;
        background-color: #333;
        animation: sk-circleFadeDelay-ios 1.2s infinite ease-in-out both;
    }
    .sk-fading-circle.white .sk-circle-ios:before{
        background: #fff;
    }
    .sk-fading-circle .sk-circle2 {
        transform: rotate(30deg);
    }

    .sk-fading-circle .sk-circle3 {
        transform: rotate(60deg);
    }

    .sk-fading-circle .sk-circle4 {
        transform: rotate(90deg);
    }

    .sk-fading-circle .sk-circle5 {
        transform: rotate(120deg);
    }

    .sk-fading-circle .sk-circle6 {
        transform: rotate(150deg);
    }

    .sk-fading-circle .sk-circle7 {
        transform: rotate(180deg);
    }

    .sk-fading-circle .sk-circle8 {
        transform: rotate(210deg);
    }

    .sk-fading-circle .sk-circle9 {
        transform: rotate(240deg);
    }

    .sk-fading-circle .sk-circle10 {
        transform: rotate(270deg);
    }

    .sk-fading-circle .sk-circle11 {
        transform: rotate(300deg);
    }

    .sk-fading-circle .sk-circle12 {
        transform: rotate(330deg);
    }

    .sk-fading-circle .sk-circle2:before {
        animation-delay: -1.1s;
    }

    .sk-fading-circle .sk-circle3:before {
        animation-delay: -1s;
    }

    .sk-fading-circle .sk-circle4:before {
        animation-delay: -0.9s;
    }

    .sk-fading-circle .sk-circle5:before {
        animation-delay: -0.8s;
    }

    .sk-fading-circle .sk-circle6:before {
        animation-delay: -0.7s;
    }

    .sk-fading-circle .sk-circle7:before {
        animation-delay: -0.6s;
    }

    .sk-fading-circle .sk-circle8:before {
        animation-delay: -0.5s;
    }

    .sk-fading-circle .sk-circle9:before {
        animation-delay: -0.4s;
    }

    .sk-fading-circle .sk-circle10:before {
        animation-delay: -0.3s;
    }

    .sk-fading-circle .sk-circle11:before {
        animation-delay: -0.2s;
    }

    .sk-fading-circle .sk-circle12:before {
        animation-delay: -0.1s;
    }

    @-webkit-keyframes sk-circleFadeDelay {
        0%, 39%, 100% {
            opacity: 0;
        }
        40% {
            opacity: 1;
        }
    }

    @keyframes sk-circleFadeDelay {
        0%, 39%, 100% {
            opacity: 0;
        }
        40% {
            opacity: 1;
        }
    }

    @-webkit-keyframes sk-circleFadeDelay-ios {
        0%, 39%, 100% {
            opacity: .3;
        }
        40% {
            opacity: 1;
        }
    }

    @keyframes sk-circleFadeDelay-ios {
        0%, 39%, 100% {
            opacity: .3;
        }
        40% {
            opacity: 1;
        }
    }
</style>
