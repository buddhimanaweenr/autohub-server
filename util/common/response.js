const errorMsg = (message, error = null) => {

    let msg = {
        status: 'error',
        message: message
    }


    if (error !== null && error.message) msg.message = error.message;
    if (error !== null) msg.error = error;


    return msg;

}

const successMsg = (message, data = null) => {

    let msg = {
        status: 'success',
        message: message
    }

    if (data !== null) msg.data = data;

    return msg;

}


module.exports = {
    error: errorMsg,
    success: successMsg,
}