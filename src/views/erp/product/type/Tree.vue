<template>
    <div style="width: 500px">
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">

                <div><el-button @click="showAddTypeView"  style="float: left" size="mini" type="primary">添加顶级分类</el-button></div>
            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <el-tree :data="treeData"   :props="props">
                    <span class="custom-tree-node" slot-scope="{node}">
                        <span>{{node.label}}</span>
                        <span style="padding-right: 0px">
                            <el-button @click="showAddTypeView(node.data.id)"  type="primary" size="mini" icon="el-icon-plus">添加子分类</el-button>
                            <el-button @click="showEditTypeView(node)" type="success" size="mini" icon="el-icon-edit">修改</el-button>
                            <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                        </span>
                    </span>
                </el-tree>
            </el-main>
        </el-container>

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false" :center="true">
            <type-form :isEdit="isEdit" :oldType="oldType" @callback="callback" @close="closeWin"></type-form>
        </el-dialog>
    </div>
</template>

<script>
    import TypeForm from "@/views/erp/product/type/TypeForm";
    export default {
        name: "Tree",
        components: {TypeForm},
        mounted(){
            this.loadTreeData();
        },
        methods:{
            callback(){
                this.loadTreeData();
                this.dialogVisible = false;
            },
            loadTreeData(){
                this.getRequest('/product/type/tree').then((result)=>{
                    this.treeData = result.data;
                })
            },
            closeWin(){
                this.dialogVisible = false;
            },
            showEditTypeView(node){
                this.isEdit = true;
                this.oldType = node.data;
                this.dialogTitle="修改分类";
                this.dialogVisible = true;
            },
            showAddTypeView(parentId){

                this.isEdit = false;
                this.oldType={
                    name:'',
                    code:''
                };
                if(parentId){
                    Object.assign(this.oldType,{parentId:parentId});
                }

                this.dialogTitle="添加分类";
                this.dialogVisible = true;
            }
        },
        data(){
            return{
                treeData:[],
                props:{
                    label:"name"
                },
                dialogTitle:'',
                dialogVisible:false,
                oldType:{},
                isEdit:false
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