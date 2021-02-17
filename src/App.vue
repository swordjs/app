<script>
    import {
        onLaunch,
        onShow,
        onHide
    } from 'vue'
    export default {
        setup() {
            onLaunch(() => console.log('App Launch'))
            onShow(() => console.log('App Show'))
            onHide(() => console.log('App Hide'))
        }
    }
</script>

<style lang="scss">
</style>
