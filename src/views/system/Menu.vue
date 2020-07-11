<template>
    <div>
        <el-container style="width: 50%;text-align: center" >
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div>
                    <el-button @click="showAddMenuView('')" size="mini" style="margin-left: 5px">增加一级菜单</el-button>
                </div>
                <div style="margin-left: 5px;margin-right: 20px;display: inline">
                    <el-input size="mini" placeholder="输入关键字进行过滤"
                              clearable
                              style="width: 350px;margin: 0px;padding: 0px;"
                              prefix-icon="el-icon-search"
                              v-model="filterText"
                    ></el-input>

                </div>
            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <el-tree ref="tree" :data="menus" :props="props" :filter-node-method="filterNode" :highlight-current="true" :expand-on-click-node="false">
                    <span class="custom-tree-node" slot-scope="{node,data}">
							<span>{{ node.label }}</span>
							<span>
								<el-button
                                        type="text"
                                        size="mini"
                                        @click="showAddMenuView(data.id)">
									增加子菜单
								</el-button>
								<el-button
                                        type="text"
                                        size="mini"
                                        @click="showEditMenuView(data)">
									编辑
								</el-button>
								<el-button
                                        type="text"
                                        size="mini"
                                        @click="()=>removeMenu(data.id)">
									删除
								</el-button>
							</span>
						</span>
                </el-tree>
            </el-main>
        </el-container>

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false">
            <menu-form :isEdit="isEdit" :oldMenu="oldMenu" @closeDialog="closeDialog" @callback="callback"></menu-form>
        </el-dialog>
    </div>
</template>

<script>
    import MenuForm from "@/views/system/MenuForm";
    export default {
        name: "Menu",
        components: {MenuForm},
        mounted:function(){
            this.loadMenu();
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        methods:{
            callback(menu){
                if(this.isEdit){
                    this.putNoEnCodeRequest('/menu/update',menu).then(resp=>{
                        if(resp&&resp.status=="200"){
                            this.$message.success("更新成功");
                            this.closeDialog();
                        }else{
                            this.$message.error("更新失败");
                        }
                    })
                }else{
                    this.postNoEnCodeRequest('/menu/addMenu',menu).then(resp=>{
                        if(resp&&resp.status=="200"){
                            this.$message.success("保存成功");
                            this.closeDialog();
                        }else{
                            this.$message.error("保存失败");
                        }
                    })
                }
            },
            filterNode(value,data){
                console.log(data);
                if (!value) return true;
                return data.title.indexOf(value) !== -1;
            },
            removeMenu(id){
                this.$confirm('此操作将永久删除，是否继续?','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=>{
                    this.deleteRequest('/menu/del/'+id).then(resp=>{
                        if(resp.data&&resp.data.status=="success"){
                            this.$message.success("删除成功");
                            this.loadMenu();
                        }else{
                            this.$message.error(resp.data.msg);
                        }
                    }).catch(()=>{
                        this.$message.error("删除失败");
                    })
                })
            },
            loadMenu(){
                this.getRequest('/menu/getAllMenu').then(resp=>{
                    this.menus = resp.data;
                })
            },
            closeDialog(){
                this.dialogVisible=false;
                //this.loadMenu();
            },
            showEditMenuView(data){
                this.isEdit = true;
                this.oldMenu ={...data} ;
                this.dialogVisible = true;


            },
            showAddMenuView(id){
                this.isEdit = false;
                if(id){
                    this.dialogTitle="添加子级菜单"
                }else{
                    this.dialogTitle = "添加一级菜单"
                }
                this.oldMenu={
                    name:'',
                    title:'',
                    iconCls:'el-icon-tickets',
                    path:'',
                    component:'',
                    type:'NORMAL',
                    parentId:id
                }
                this.dialogVisible = true;
            }
        },
        data(){
            return{
                filterText:'',
                dialogTitle:'',
                props:{
                    label:'title',
                    children:'children'
                },
                menus:[],
                dialogVisible:false,
                oldMenu:{},
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