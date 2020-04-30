import axios from 'axios'
import {Message} from "element-ui";

axios.defaults.withCredentials = true
axios.interceptors.response.use(data=>{
    return data;
},err=>{
    if(err.response.status==401){
        Message.error({message:"没有访问权限，需要进行身份认证"});
    }
})
let base = 'http://192.168.1.177:8081'

export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: base+url,
        data: params,

        transformRequest: [function (data) {
            let ret = ''
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
        }]
    });
}
export const getRequest=(url)=>{
    return axios({
        method:'get',
        url:base+url
    })
}
export const deleteRequest = (url) => {
    return axios({
        method: 'delete',
        url: base+url
    });
}
export const postNoEnCodeRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params
    });
}
export const putNoEnCodeRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params
    });
}
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = ''
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
