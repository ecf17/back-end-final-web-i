export function hasRole(requiredRole) {
    return (req, res, next) => {
        const userRole = req.user?.role;

        if (!userRole) {
            return res.status(401).json({ message: `Unauthorized: Role not found, role: ${req.user?.role}` });
        }

        if (userRole === requiredRole) {
            return next();
        }

        return res.status(403).json({ message: `Forbidden: Requires ${requiredRole} role` });
    };
}

