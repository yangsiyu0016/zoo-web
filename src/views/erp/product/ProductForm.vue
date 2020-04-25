<template>
    <div>
        <el-form ref="productForm" :model="product" label-width="120px" :rules="rules">
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float:left">基本信息</span>
                </div>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="分类:" prop="typeId">
                            <el-cascader ref="typeCascader"  @change="typeChange" style="float: left;width: 300px;padding-top:7px" size="mini" v-model="product.typeId" :options="types" :props="props"></el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="品牌:" prop="brandId">
                            <el-select :clearable="true" style="float: left" v-model="product.brandId" size="mini">
                                <el-option v-for="item in brands" :key="item.id" :label="item.name"  :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="产品名称：" prop="name">
                        <el-input size="mini" v-model="product.name"></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="包装清单:" prop="packageList">
                        <el-input size="mini" v-model="product.packageList"></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="售后服务:" prop="afterService">
                        <el-input size="mini" v-model="product.afterService"></el-input>
                    </el-form-item>
                </el-row>
            </el-card>
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float:left">规格参数</span>
                </div>
                <el-row v-for="param in specs" :key="param.name">
                    <el-form-item :label="param.name+':'">
                        <el-input size="mini" v-model="param.v"></el-input>
                    </el-form-item>
                </el-row>
            </el-card>
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span style="float:left">SKU属性</span>
                </div>

                <v-card flat v-for="spec in specialSpecs" :key="spec.name">
                    <!--特有参数的标题-->
                    <div class="subheading">{{spec.name}}:</div>
                    <!--特有参数的待选项，需要判断是否有options，如果没有，展示文本框，让用户自己输入-->
                    <v-card-text class="px-5">
                        <div v-for="i in spec.options.length+1" :key="i" class="layout row px-5">
                            <v-text-field :placeholder="'新的' + spec.name + ':'" class="flex xs10" auto-grow
                                          v-model="spec.options[i-1]" v-bind:value="i" single-line hide-details/>
                            <v-btn @click="spec.options.splice(i-1,1)" v-if="i <= spec.options.length" icon>
                                <i class="el-icon-delete"/>
                            </v-btn>
                        </div>
                    </v-card-text>
                </v-card>
                <v-card class="elevation-0">
                    <!--标题-->
                    <div class="subheading py-3">SKU列表:</div>

                    <v-divider/>
                    <!--SKU表格，hide-actions因此分页等工具条-->
                    <v-data-table :items="skus" :headers="headers" hide-default-footer item-key="indexes" class="elevation-0">
                        <template slot="items" slot-scope="props">
                            <tr >

                                <!--enable展示为checkbox-->
                                <td v-for="(v,k) in props.item" :key="k" class="text-xs-center" v-if="k === 'enable'">
                                    <v-checkbox v-model="props.item[k]"/>
                                </td>
                                <!--indexes和images不展示，其它展示为普通文本-->
                                <td class="text-xs-center" v-else-if="k !== 'images' && k !== 'indexes'">{{v.v}}</td>
                            </tr>
                        </template>
                        <!--点击表格后展开-->
                        <!-- <template slot="expand" slot-scope="props">
                            <v-card class="elevation-2 flex xs11 mx-auto my-2">
                                <v-upload v-model="props.item.images" url="/product/uploadImage"/>
                            </v-card>
                        </template> -->
                    </v-data-table>
                </v-card>
            </el-card>
            <el-card>
                <el-button @click="submit('productForm')" size="mini" type="primary">保存产品信息</el-button>
            </el-card>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "ProductForm",
        mounted(){
            this.loadTypes();
        },
        methods:{
            submit(formName){
                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        //处理typeId
                        let nodes = this.$refs['typeCascader'].getCheckedNodes(true);
                        this.product.typeId=nodes[0].data.id;
                        const {...productParams} = this.product;
                        // 处理规格参数
                        const specs ={};
                        this.specs.forEach(({id,v})=>{
                            specs[id] = v;
                        });
                        // 处理特有规格参数模板
                        const specTemplate={};
                        this.specialSpecs.forEach(({id,options})=>{
                            specTemplate[id] = options;
                        });
                        //处理sku
                        const skus = this.skus.filter(s=>s.enable).map(({enable,indexes,...rest})=>{
                            const name = this.product.name+" "+Object.values(rest).map(v=>v.v).join(" ");
                            const obj = {};
                            Object.values(rest).forEach(v=>{
                                obj[v.id]=v.v;
                            });
                            return{
                                indexes,
                                name,
                                enable,
                                ownSpec:JSON.stringify(obj)// 特有规格参数
                            }
                        });
                        Object.assign(productParams,{skus});
                        productParams.productDetail.genericSpec = JSON.stringify(specs);
                        productParams.productDetail.specialSpec = JSON.stringify(specTemplate);
                        console.log(productParams);
                        this.postNoEnCodeRequest('/product/add',productParams).then((resp)=>{

                        })
                    }else{
                        this.focusToError();
                    }
                })
            },
            typeChange(){

                let nodes = this.$refs['typeCascader'].getCheckedNodes(true);
                if(nodes.length>0){
                    this.getRequest('/product/brand/getBrandByTypeId?typeId='+nodes[0].data.id).then((resp)=>{
                        this.brands=resp.data;
                    });
                    this.getRequest('/product/spec/params?typeId='+nodes[0].data.id).then((resp)=>{
                        let data = resp.data;
                        //对特有规格进行筛选
                        const arr1 =[];
                        const arr2 = [];
                        data.forEach(({id,name,generic,isNumeric,unit}) => {
                            if(generic){
                                const o = {id,name,generic,isNumeric,unit};
                                arr1.push(o);
                            }else{
                                const o = {id,name,options:[]};
                                arr2.push(o);
                            }
                        });
                        this.specs = arr1;//通用规格
                        this.specialSpecs = arr2;//特有规格
                    })
                }else{
                    this.brands = [];
                    this.specs = [];
                    this.specialSpecs =[];
                }

            },
            loadTypes(){
                this.getRequest('/product/type/tree').then((result)=>{
                    this.types = result.data;
                })
            }
        },
        computed:{
            skus(){
                // 过滤掉用户没有填写数据的规格参数
                const arr = this.specialSpecs.filter(s => s.options.length > 0);
                // 通过reduce进行累加笛卡尔积
                return arr.reduce((last,spec,index)=>{
                    const result = [];
                    last.forEach(o=>{
                        spec.options.forEach((option,i)=>{
                            const obj = JSON.parse(JSON.stringify(o));
                            obj[spec.name] = {v:option, id:spec.id};
                            obj.indexes = (obj.indexes || '') + '_' +  i;
                            if(index===arr.length-1){
                                // 如果发现是最后一组，则添加价格、库存等字段
                                obj.indexes = obj.indexes.substring(1);
                                Object.assign(obj,{
                                    enable:false
                                })
                            }
                            result.push(obj);
                        })
                    })
                    return result;
                },[{}]);
            },
            headers(){
                if(this.skus.length<=0){
                    return [];
                }
                const headers =[];
                Object.keys(this.skus[0]).forEach(k=>{
                    let value = k;
                    if(k==="enable"){
                        // enable，表头要翻译成“是否启用”
                        k="是否启动";
                    }else if(k==='indexes'){
                        return;
                    }
                    headers.push({
                        text:k,
                        align:"center",
                        sorttable:false,
                        value
                    })
                })
                return headers;
            }
        },
        data(){
            return{
                types:[],
                brands:[],
                specs:[],
                specialSpecs:[],
                props:{
                    label:'name',
                    value:'id'
                },
                product:{
                    typeId:'',
                    brandId:'',
                    name:'',
                    productDetail:{
                        packageList:'',
                        afterService:''
                    },
                    specs:[],
                    specialSpecs:[]

                },
                rules:{
                    typeId:[{required:true,message:"请选择分类",trigger:'blur'}],
                    name:[{required:true,message:"名称不能为空",trigger:'blur'}]
                }
            }
        }
    }
</script>

<style scoped>

</style>