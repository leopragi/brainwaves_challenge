function getResult(error, data) {
    return { error, data };
};

function responseHanlder(result, req, res, next){
    let message = result.error ? 'Error occured' : 'Success'
    res.json({
        message: message,
        data: result.data,
        success: result.success,
    });    
}

function asyncMiddleware(fn) {
    return (req, res, next) => {
        fn(req, res)
        .then(result => {
            next(getResult(false, result))
        })
        .catch(error => {
            next(getResult(true, null))
        })
    }
}

module.exports = {
    responseHanlder,
    asyncMiddleware
}