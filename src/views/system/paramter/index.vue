<template>
    <div>
        <el-container >
            <el-header>
                <el-button size="mini" @click="showAddParameterView">添加参数</el-button>
            </el-header>
            <el-divider></el-divider>
            <el-container style="border: 1px">
                <el-aside width="230px">
                    <el-container >
                        <el-header height="30px">
                            <el-button size="mini" @click="showAddDirectoryView">添加目录</el-button>
                        </el-header>
                        <el-main>
                            <el-tree :data="directorys" :props="props" :default-expand-all="defaultExpandAll"></el-tree>
                        </el-main>
                    </el-container>
                </el-aside>
                <el-container>
                    <el-main>
                        <el-table size="mini" :data="parameters">
                            <el-table-column type="index" width="30px"></el-table-column>
                            <el-table-column label="参数名称" prop="name"></el-table-column>
                            <el-table-column label="参数值" prop="parameterValue"></el-table-column>
                            <el-table-column label="参数代码" prop="code"></el-table-column>
                            <el-table-column label="备注" prop="description"></el-table-column>
                        </el-table>
                    </el-main>
                </el-container>
            </el-container>
        </el-container>
        <el-dialog :visible.sync="directoryDialogVisible" :title="directoryDialogTitle" :close-on-click-modal="false">
            <directory-form @close="closeDirectoryDialog" @callback="directoryCallback"></directory-form>
        </el-dialog>
        <el-dialog :visible.sync="parameterDialogVisible" :title="parameterDialogTitle" :close-on-click-modal="false">
            <parameter-form @close="closeParameterDialog" @callback="parameterCallback"></parameter-form>
        </el-dialog>
    </div>
</template>

<script>
    import DirectoryForm from "@/views/system/paramter/DirectoryForm";
    import ParameterForm from "@/views/system/paramter/ParameterForm";
    export default {
        name: "index",
        components: {ParameterForm, DirectoryForm},
        mounted(){
            this.loadDirectory();
            this.loadParameter();
        },
        methods:{
            parameterCallback(){
                this.loadParameter();
                this.closeParameterDialog();
            },
            closeParameterDialog(){
                this.parameterDialogVisible = false;
            },
            showAddParameterView(){
                this.parameterDialogTitle="添加参数";
                this.parameterDialogVisible = true;
            },
            loadParameter(){
                this.getRequest('/system/parameter/list').then(resp=>{
                    this.parameters = resp.data;
                })
            },
            loadDirectory(){
                this.getRequest('/system/parameterDirectory/tree').then(resp=>{
                    this.directorys[0].children = resp.data;
                })
            },
            directoryCallback(){
                this.loadDirectory();
                this.closeDirectoryDialog();
            },
            closeDirectoryDialog(){
                this.directoryDialogVisible = false;
            },
            showAddDirectoryView(){
                this.directoryDialogTitle="添加参数目录";
                this.directoryDialogVisible = true;
            }
        },
        data(){
            return{
                props:{
                    label:'name'
                },
                defaultExpandAll:true,
                directorys:[{
                    name:'参数目录',
                    children:[]
                }],
                directoryDialogVisible:false,
                directoryDialogTitle:'',
                parameters:[],
                parameterDialogVisible:false,
                parameterDialogTitle:''
            }
        }
    }
</script>

<style scoped>

</style>