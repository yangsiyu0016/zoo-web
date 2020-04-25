<template>
    <div style="width: 500px">
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">

                <div><el-button  style="float: left" size="mini" type="primary">添加国家</el-button></div>
            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <el-tree :load="loadData" lazy  :props="props">
                    <span class="custom-tree-node" slot-scope="{node}">
                        <span>{{node.label}}</span>
                        <span style="padding-right: 0px">
                            <i class="el-icon-plus" >添加</i>
                            <i class="el-icon-delete">删除</i>
                            <i class="el-icon-edit">修改</i>
                        </span>
                    </span>
                </el-tree>
            </el-main>
        </el-container>


    </div>
</template>

<script>
    export default {
        name: "Area",

        data(){
            return{
                props:{
                    label:"name"
                },
                areas:[]
            }
        },
        mounted:function(){
            //this.loadData();
        },

        methods:{
            loadData(node,resolve){
                let parentId=0;
                if(node.level!=0) parentId=node.data.id;
                this.getRequest('/area/getDataByParentId?parentId='+parentId).then((resp)=>{
                    resolve(resp.data);
                })
            }
        }

    }
</script>

<style scoped>
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>