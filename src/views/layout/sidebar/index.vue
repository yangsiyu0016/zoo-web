<template>
    <div>
        <el-menu :default-active="$route.path" mode="vertical"
                 router
                 :unique-opened="false"
                 :collapse-transition="false">
            <sidebar-item :menu="getrouters"></sidebar-item>
        </el-menu>
    </div>
</template>

<script>
    import {mapGetters} from "vuex"
    import SidebarItem from "@/views/layout/sidebar/SidebarItem";
    export default {
        name: "index",
        components: {SidebarItem},
        computed:{
            ...mapGetters(["getrouters"])
        }
    }
</script>

<style scoped>

</style>