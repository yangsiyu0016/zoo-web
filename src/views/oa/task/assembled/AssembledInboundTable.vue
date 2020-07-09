<template>
    <div>
        <el-container>
            <el-header>
                <el-button @click="showAddView" size="mini" type="primary" icon="el-icon-plus">新增</el-button>
            </el-header>
            <el-main>
                <el-table size="mini" :data="details">
                    <el-table-column type="index" width="80"></el-table-column>
                    <el-table-column label="货位" prop="goodsAllocation.name"></el-table-column>
                    <el-table-column label="数量" prop="number"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button @click="deleteDetail(scope.row)" icon="el-icon-delete" type="danger" size="mini" style="padding: 3px 4px 3px 4px;margin: 2px">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
            <el-footer style="text-align: center">
                <el-button icon="el-icon-close" type="info" size="mini" @click="close">取消</el-button>
                <el-button icon="el-icon-check" @click="saveInbound" type="primary" size="mini">保存</el-button>
            </el-footer>
        </el-container>
        <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" :append-to-body="true" :close-on-click-modal="false" width="40%">
            <assembled-inbound-form :oldData="oldData" :not-in-number="maxNumber" :oldProductAssembled="oldProductAssembled" @cancel="cancel" @callback="callback"></assembled-inbound-form>
        </el-dialog>
    </div>
</template>

<script>
    import AssembledInboundForm from "./AssembledInboundForm"
    export default {
        name: "AssembledInboundTable",
        components: {AssembledInboundForm},
        props:{
            oldProductAssembled: {
                type: Object,
                default: () => {}
            }
        },
        watch: {
            details:{
                handler(val) {
                    this.details.forEach(detail => {
                        this.maxNumber-=detail.number;
                    })
                },
                deep: true,
                immediate: true
            }
        },
        data() {
            return {
                details:[],
                dialogVisible: false,
                dialogTitle: '',
                oldData:{

                },
                maxNumber:0,
            }
        },
        methods:{
            showAddView() {
                this.dialogVisible = true;
                this.dialogTitle = '货位设置';
                this.oldData = {
                    goodsAllocation: {},
                    number: 0,
                    product: {
                        id: '',
                        name: ''
                    }
                }
            },
            deleteDetail(row) {
                this.details.some((item, i) => {
                    if (item == row) {
                        this.details.splice(i, 1);
                    }
                })
            },
            saveInbound() {
                this.postNoEnCodeRequest('/erp/assembled/addInbound', {
                    foreignKey: this.oldProductAssembled.id,
                    details: this.details
                }).then(resp => {
                    if (resp.data && resp.data.status == "200") {
                        this.$message.success(resp.data.msg);
                        this.details = [];
                        this.$emit('callback')
                    }else {
                        this.$message.error(resp.data.msg)
                    }
                })
            },
            callback(data) {
                this.details.push(data);
                this.oldProductAssembled.notInNumber -= data.number;
                this.cancel();
            },
            cancel(){
                this.dialogVisible = false;
            },
            close(){
                this.$emit("close");
                this.details = [];
            }
        }
    }
</script>

<style scoped>

</style>