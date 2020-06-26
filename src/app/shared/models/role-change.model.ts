import { BoxScope, Role } from '@teamberry/muscadine'

export class RoleChangeRequest {
    /**
     * The requester
     *
     * @type {string}
     * @memberof RoleChangeRequest
     */
    source: string
    /**
     * Who and where to apply the request
     *
     * @type {BoxScope}
     * @memberof RoleChangeRequest
     */
    scope: BoxScope
    /**
     * The role to give to the target (source.userToken)
     *
     * @type {Role}
     * @memberof RoleChangeRequest
     */
    role: Role
}
