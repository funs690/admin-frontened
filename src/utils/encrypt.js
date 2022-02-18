import JSEncrypt from 'JSEncrypt'

/**
 *  RSA加密
 * @param {公钥数据} publicKey
 * @param {待加密数据} data
 * @returns
 */
export function RsaEncrypt(publicKey, data) {
    //加密数据初始话
    let encrypt = new JSEncrypt({ default_key_size: 1024 })
    //设置公钥
    encrypt.setPublicKey(publicKey)
    //数据加密
    return encrypt.encrypt(data)
}
