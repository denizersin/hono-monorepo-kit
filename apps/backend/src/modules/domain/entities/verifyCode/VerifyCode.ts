import { TSchemaVerifyCode } from "@repo/shared/schema";

namespace TVerifyCodeEntity {
    export type TVerifyCode = TSchemaVerifyCode.TTblVerifyCodeSelect;
    export type TVerifyCodeInsert = TSchemaVerifyCode.TTblVerifyCodeInsert;
}

export default TVerifyCodeEntity; 