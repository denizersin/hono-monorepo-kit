import { TSchemaUser } from "@repo/shared/schema"


namespace TUserEntity {
    export type TUser = TSchemaUser.TTblUserSelect
    export type TUserInsert = TSchemaUser.TTblUserInsert
}

export default TUserEntity 