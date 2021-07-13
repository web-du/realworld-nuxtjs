import { request } from '@/plugins/request'

// 用户登录
export const login = data => {
    return request({
        method: 'POST',
        url: '/api/users/login',
        data
    })
}

// 用户注册
export const register = data => {
    return request({
        method: 'POST',
        url: '/api/users',
        data
    })
}

// 用户简况
export const getProfile = username => {
    return request({
        method: 'GET',
        url: `/api/profiles/${username}`
    })
}

// Follow user
export const followUser = username => {
    return request({
        method: 'POST',
        url: `/api/profiles/${username}/follow`
    })
}

// Unfollow user
export const unfollowUser = username => {
    return request({
        method: 'DELETE',
        url: `/api/profiles/${username}/follow`
    })
}

// Get Current User
export const getCurrentUser = () => {
    return request({
        method: 'GET',
        url: `/api/user`
    })
}

// Update User
export const updateUser = data => {
    return request({
        method: 'PUT',
        url: '/api/user',
        data
    })
}