/**
 * Created by Administrator on 2020/5/27 0027.
 */
import request from '../utils/request'

//登录
export function login(username,password){
  return request({
    url:'/mobileLogin?username='+username+'&password='+password,
    method:'post'
  })
}