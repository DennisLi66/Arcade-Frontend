function isAnEmail(email: string) : boolean{
    var regex = '/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/';
    if (email.match(regex)) return true;
    return false;
}

export default isAnEmail;