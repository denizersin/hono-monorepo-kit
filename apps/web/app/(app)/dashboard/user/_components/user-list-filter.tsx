import { TUserValidator } from "@repo/shared/validators"

export const UserListFilter = ({ query, setQuery }: { query: TUserValidator.TUserPaginationQuery, setQuery: (query: TUserValidator.TUserPaginationQuery) => void }) => {
    return (
        <div>
            <h1>User List Filter</h1>
        </div>
    )
}