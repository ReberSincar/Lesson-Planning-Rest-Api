import { Injectable } from "@nestjs/common";
import * as RANDOM from "randomstring";

@Injectable()
export class RandomUtils {
    public static randomNumber(length: number = 6) {
        return Math.floor(Math.random() * 10 ** length);
    }

    public static randomString(length: number = 10): string {
        return RANDOM.generate({
            length: length,
            charset: "alphabetic",
        });
    }

    public static randomAlphaNumeric(length: number = 10): string {
        return RANDOM.generate({
            length: length,
            charset: "alphanumeric",
        });
    }
}
