<template>
    <div style="margin:10px 5px 15px 20px;">
        <el-row>
            <!--产品分类-->
            <el-col :span="6">
                <el-card shadow="hover" >
                    <div slot="header" class="clearfix">
                        <span>选择分类，查看规格参数模板</span>
                    </div>
                    <div>
                        <type-tree @handleClick="handleClick"></type-tree>
                    </div>
                </el-card>
            </el-col>
            <!--规格参数-->
            <el-col :span="18">
                <el-card shadow="hover" v-show="currentNode.id">
                    <div slot="header" class="clearfix">
                        <el-tag type="success">分类:{{currentNode.name}}</el-tag>
                    </div>
                    <div>
                        <spec-group @setCurrentGroup="setCurrentGroup" :typeId="currentNode.id"></spec-group>
                    </div>
                </el-card>
                <el-card shadow="hover" v-show="currentGroup.id">
                    <div slot="header" class="clearfix">
                        <el-tag type="success">分组:{{currentGroup.name}}</el-tag>
                    </div>
                    <div>
                        <spec-param :groupId="currentGroup.id" :typeId="currentNode.id"></spec-param>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import TypeTree from "@/views/erp/product/spec/TypeTree";
    import SpecGroup from "@/views/erp/product/spec/SpecGroup";
    import SpecParam from "@/views/erp/product/spec/SpecParam";
    export default {
        name: "index",
        components: {SpecParam, SpecGroup, TypeTree},
        methods:{
            setCurrentGroup(group){
                this.currentGroup = group;
            },
            handleClick(node){
                let isParent = false;
                if(node.children&&node.children.length>0){
                    isParent = true;
                }
                if(!isParent){
                    this.currentNode = node;
                }
            }
        },
        data(){
            return{
                currentNode:{},// 当前被选中的商品分类节点
                currentGroup:{}//当前被选中的分组
            }
        }
    }
</script>

<style scoped>

</style>