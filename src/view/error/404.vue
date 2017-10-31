<template>
    <div>
        <div class="not" v-text="'error  ' + $route.path + '  is not found'"></div>
        <router-link to="/">返回</router-link>
    </div>
</template>

<script>
    export default {
        data () {
            return {}
        },
        components: {},
        methods: {}
    }
</script>

<style>
    .not {
        color: #fff;
        background: red;
    }
</style>
