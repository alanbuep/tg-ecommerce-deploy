import enumErrors from "../services/enumError";

export default (error, req, res, next) => {
    switch (error.code) {
        case enumErrors.ADD_PRODUCT_ERROR:
            res.status(500).json({
                message: error.message,
                code: error.code,
                cause: error.cause,
            });
            break;

        case enumErrors.FIND_PRODUCT_ERROR:
            res.status(500).json({
                message: error.message,
                code: error.code,
                cause: error.cause,
            });
            break;

        default:
            res.status(500).json({
                message: "Error desconocido",
                code: 0,
                cause: error,
            });
            break;
    }
};