<template>
    <div>
        <el-container>
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
                <div>
                    <el-button @click="showAddMenuView('')" size="mini" style="margin-left: 5px">增加一级菜单</el-button>
                </div>
            </el-header>
            <el-main style="padding-left: 0px;padding-top: 0px">
                <el-tree :data="menus" :props="props">
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
            <menu-form :oldMenu="oldMenu" @closeDialog="closeDialog"></menu-form>
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
        methods:{
            removeMenu(id){
                this.$confirm('此操作将永久删除，是否继续?','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=>{
                    this.deleteRequest('/menu/del/'+id).then(resp=>{
                        if(resp&&resp.status==200){
                            this.$message.success("删除成功");
                            this.loadMenu();
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
                this.loadMenu();
            },
            showEditMenuView(data){
                this.oldMenu ={...data} ;
                this.dialogVisible = true;


            },
            showAddMenuView(id){
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
                dialogTitle:'',
                props:{
                    label:'title',
                    children:'children'
                },
                menus:[],
                dialogVisible:false,
                oldMenu:{}
            }
        }
    }
</script>

<style scoped>

</style>