var bcrypt = require('bcryptjs');

export class PasswordUtils {
    private static salt = bcrypt.genSaltSync(10);

    public static comparePassword(password: string, hash: string) {
        const result = bcrypt.compareSync(password, hash);
        return result;
    }

    public static createHashedPassword(password: string) {
        const hash = bcrypt.hashSync(password, this.salt);
        return hash;
    }
}
