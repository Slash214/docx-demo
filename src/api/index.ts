const baseURL = 'https://www.fastmock.site/mock/7dcd4f06643158e8b6bb6bd7c7dab860/api'
import request from "./http"

export function getDocx() {
    return request({
        url: `${baseURL}/mock/word`,
        method: 'GET',
    })
}

export function getTable() {
    return request({
        url: `${baseURL}/mock/table`,
        method: 'GET'
    })
}

export function getIrrge() {
    return request({
        url: `${baseURL}/mock/irrge`,
        method: 'GET'
    })
}


/**
 * 获取word图文数据
 */
export const getImageText = () => {
    return request({
        url: `${baseURL}/v1/imagetext`,
        method: 'GET'
    })
}

/**
 * 新版图文数据
 */
export const getNewData = () => {
    return request({
        url: `${baseURL}/v1/new/phtotalbum`,
        method: 'GET'
    })
}