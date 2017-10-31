import axios from 'axios';

const setFormData = ( data ) => {
    let formData = new FormData();
    for ( let key in data ) {
        if ( data.hasOwnProperty( key ) ) {
            formData.append( key, data[ key ] );
        }
    }
    return formData;
}

const Ajax = axios.create( {
    timeout: 2000,
    responseType: 'json',
    withCredentials: false,
    transformRequest: [ function ( data ) {
        return setFormData( data )
    } ],
    transformResponse: [ function ( data ) {
        return data;
    } ],
} )


const getObjectParams = ( params ) => {

    // 判断是否是一个字符串JSON   并且包含 { 或者 }
    if ( typeof params === 'string' ) {

        return JSON.parse( params )

        // 判断是否是一个对象
    } else if ( typeof params === 'object' ) {

        return params;
        //如果以上都不是  则认为是一个普通字符串
    }
}

export default {
    async get( url, data ){
        return getObjectParams((await Ajax.get( url, data )).data);
    },
    async post( url, data ){
        return getObjectParams((await Ajax.post( url, data )).data);
    }
}