exports.success = (message, data) => {
    return {message, data};
};
exports.success = (message, data) => {
    return { success: true, message, data };
};

exports.error = (message, details = null) => {
    return { success: false, message, ...(details && { details }) };
};