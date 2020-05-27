<template>
    <div style="width: 500px">
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">

                <div><el-button @click="showAddTopView()"  style="float: left" size="mini" type="primary">添加国家</el-button></div>
            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <el-tree ref="tree" :load="loadData" lazy  :props="props" :expand-on-click-node="false" node-key="id">
                    <span class="custom-tree-node" slot-scope="{node}">
                        <span>{{node.label}}</span>
                        <span style="padding-right: 0px">
                            <el-button @click="showAddAreaView(node)" type="primary" size="mini">添加下级区域</el-button>
                            <i class="el-icon-delete">删除</i>
                            <i class="el-icon-edit">修改</i>
                        </span>
                    </span>
                </el-tree>
            </el-main>
        </el-container>

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false">
            <area-form :isEdit="isEdit" :oldNode="oldNode" @callback="callback" @close="closeWin"></area-form>
        </el-dialog>
    </div>
</template>

<script>
    import AreaForm from "@/views/system/base/AreaForm";
    export default {
        name: "Area",
        components: {AreaForm},
        data(){
            return{
                props:{
                    label:"name"
                },
                areas:[],
                dialogTitle:'',
                dialogVisible:false,
                currnetNode:{},
                isEdit:false,
                oldNode:{}
            }
        },
        mounted:function(){

        },

        methods:{
            callback(area){
                if(this.isEdit){

                }else{
                    if(this.currentNode){
                        Object.assign(area,{parentId:this.currentNode.data.id});
                    }
                    this.postNoEnCodeRequest('/area/addArea',area).then((resp)=>{
                        if(resp&&resp.data.status=="200"){
                            this.$message.success("保存成功");

                            let tree = this.$refs['tree'];
                            if(this.currentNode){
                                tree.append(resp.data.area,this.currentNode.key);
                                tree.getNode(this.currentNode.key).expanded = true;
                                this.closeWin();
                            }else{
                                this.closeWin();
                                this.$message.info("请手动刷新一下页面");
                            }
                            //this.currentNode.append(resp.data.area);
                            //this.currentNode.expanded = true;
                        }else{
                            this.$message.error(resp.data.msg);
                        }
                    })
                }
            },
            closeWin(){
                this.dialogVisible = false;
            },
            showAddTopView(){
                this.isEdit = false;
                this.currentNode = null;
                this.oldeNode={};

                this.dialogTitle="添加";
                this.dialogVisible = true;
            },
            showAddAreaView(node){
                this.isEdit = false;
                this.currentNode = node;
                this.oldeNode={};
                this.dialogTitle="添加";
                this.dialogVisible = true;
            },
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