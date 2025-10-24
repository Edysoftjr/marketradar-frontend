const formatJoinDate = (dateString: string): string => {
    const date = new Date(dateString);
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    return `Joined ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

const getRoleDisplayName = (role: string): string => {
    switch (role) {
        case "ADMIN":
            return "Administrator";
        case "VENDOR":
            return "Vendor";
        case "USER":
            return "Customer";
        default:
            return "User";
    }
};

const getRoleColor = (role: string): string => {
    switch (role) {
        case "ADMIN":
            return "bg-gradient-to-r from-red-500/10 to-red-600/10 text-red-700 border-red-200/30";
        case "VENDOR":
            return "bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-700 border-blue-200/30";
        case "USER":
            return "bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 text-emerald-700 border-emerald-200/30";
        default:
            return "bg-gradient-to-r from-gray-500/10 to-gray-600/10 text-gray-700 border-gray-200/30";
    }
};

export {
    formatJoinDate,
    getRoleDisplayName,
    getRoleColor
}