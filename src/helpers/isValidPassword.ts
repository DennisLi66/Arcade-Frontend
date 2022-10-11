function isValidPassword(password: string): boolean{
    //at least 8 characters, has a capital letter, lowercase letter, number, and symbol
    if (password.length <= 7) return false;
    var capRegex = "[A-Z]";
    var lowerRegex = "[a-z]";
    var symRegex = "[\W]";
    var numRegex = "[0-9]";
    if (password.match(capRegex) && password.match(lowerRegex)
    && password.match(symRegex) && password.match(numRegex)) return true;
    return false;
}

export default isValidPassword;