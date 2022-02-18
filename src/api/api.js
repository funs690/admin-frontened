import http from './index'

/**
 * 获取公钥信息
 * @param  opts 请求参数
 */
export function get_public_key(opts) {
    return http('get', '/publicKey', opts)
}

/**
 * 登录
 * @param opts 请求参数
 */
export function post_login(opts) {
    return http('post', '/login', opts)
}

/**
 * 退出登录
 * @param opts 请求参数
 */
export function post_logout(opts) {
    return http('post', '/revokeToken', opts)
}

/**
 * 获取实体信息
 * @param opts 请求参数
 */
export function get_entity_page(opts) {
    return http('get', '/entity/page', opts)
}
