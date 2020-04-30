<template>
    <div>
        <el-form ref="userForm" :model="user" size="mini" :rules="rules" label-width="120px">

        </el-form>
    </div>
</template>

<script>
    export default {
        name: "UserForm",
        props:{
            isEdit:{
                type:Boolean,
                default:false
            },
            oldUser:{
                type:Object,
                default: ()=>{}
            }
        },
        watch:{
            oldUser:{
                handler(val){
                    this.user = JSON.parse(JSON.stringify(val));
                },
                deep:true,
                immediate:true
            }
        },
        data(){
            return{
                user:{

                },
                rules:{}
            }
        }
    }
</script>

<style scoped>

</style>