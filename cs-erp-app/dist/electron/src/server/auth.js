"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerAuthSession = exports.authOptions = void 0;
const next_auth_1 = require("next-auth");
exports.authOptions = {
    callbacks: {
        session: ({ session, user }) => ({
            ...session,
            user: {
                ...session.user,
                id: user.id,
            },
        }),
    },
    providers: [
    // Providers will be configured as needed
    ],
};
const getServerAuthSession = (ctx) => {
    return (0, next_auth_1.getServerSession)(ctx.req, ctx.res, exports.authOptions);
};
exports.getServerAuthSession = getServerAuthSession;
