<template>
    <el-tree :data="treeData"   :props="props" @node-click="nodeClick">
    </el-tree>
</template>

<script>
    export default {
        name: "TypeTree",
        mounted(){
            this.loadTreeData();
        },
        methods:{
            nodeClick(data){
                this.$emit("handleClick",data);
            },
            loadTreeData(){
                this.getRequest('/product/type/tree').then((result)=>{
                    this.treeData = result.data;
                })
            }
        },
        data(){
            return{
                treeData:[],
                props:{
                    label:"name"
                }
            }
        }
    }
</script>

<style scoped>

</style>