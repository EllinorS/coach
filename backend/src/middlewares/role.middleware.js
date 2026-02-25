export const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {

        // Security: authMiddleware has to be executed before
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Role verification
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden - insufficient role' });
        }

        next();
    };
};