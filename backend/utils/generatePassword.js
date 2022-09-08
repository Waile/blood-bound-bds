export const generatePassword = () => {
    const arr = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789!@#$%^&*()-=_+[]{}|;':,.<>/?";
    let password = "";
    for (let i = 0; i < 5; i++) {
        password += arr[Math.floor(Math.random() * arr.length)];
    }
    return password;
}

export const generateCode = () => {
    let code = "";
    for (let i = 0; i < 5; i++) {
        code += String(Math.floor(Math.random() * 10));
    }
    return code;
}