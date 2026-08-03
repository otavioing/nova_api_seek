const success = (
    res,
    message,
    data = null,
    count = null,
    status = 200
) => {

    const response = {
        success: true,
        message
    };

    if (data !== null) {
        response.data = data;
    }

    if (count !== null) {
        response.count = count;
    }

    return res.status(status).json(response);
};

const error = (
    res,
    message,
    status = 400,
    errors = null
) => {

    const response = {
        success: false,
        message
    };

    if (errors !== null) {
        response.errors = errors;
    }

    return res.status(status).json(response);
};

module.exports = {
    success,
    error
};