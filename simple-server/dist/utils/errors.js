"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMessage = void 0;
const errorMessage = (error) => {
    if (error instanceof Error)
        return error.message;
    return String(error);
};
exports.errorMessage = errorMessage;
